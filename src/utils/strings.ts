import {
  CrowdinStringsGET,
  CrowdinStringsPATCH,
} from "../interfaces/CrowdinResponses";

import { authHeader } from "./auth-header";
import { makeRequest } from "./make-request";

const isReservedHeading = (context: string, str: string) => {
  const reservedHeadings = [
    "after-user-code",
    "answers",
    "before-user-code",
    "description",
    "fcc-editable-region",
    "hints",
    "instructions",
    "question",
    "seed",
    "seed-contents",
    "solutions",
    "text",
    "video-solution",
    "tests",
    "notes",
    "fillInTheBlank",
    "sentence",
    "blanks",
    "feedback",
    "scene",
    "assignments",
  ];
  const captureGroupString = `(${reservedHeadings.join("|")})`;
  const regex = new RegExp(`--${captureGroupString}--`);
  return !!(context.match(/^Headline/) && str.match(regex));
};

const isCode = (str: string) => /^\/pre\/code|\/code$/.test(str);

const isTitle = (str: string) => str.endsWith("title");

const shouldHide = (
  text: string,
  context: string,
  challengeTitle: string,
  crowdinFilePath: string
) => {
  if (crowdinFilePath.endsWith("yml")) {
    return !isTitle(context);
  }
  if (isReservedHeading(context, text) || isCode(context)) {
    return true;
  }
  return text !== challengeTitle && context.includes("id=front-matter");
};

const getStrings = async (projectId: number, fileId?: number) => {
  const headers = { ...authHeader };
  let done = false;
  let offset = 0;
  let strings: CrowdinStringsGET["data"] = [];
  while (!done) {
    let endPoint = `projects/${projectId}/strings?limit=500&offset=${offset}`;
    if (fileId) {
      endPoint += `&fileId=${fileId}`;
    }
    const response = await makeRequest<CrowdinStringsGET>({
      method: "get",
      endPoint,
      headers,
    });
    if (response && response.data) {
      if (response.data.length) {
        strings = [...strings, ...response.data];
        offset += 500;
      } else {
        done = true;
        return strings;
      }
    } else {
      console.log(JSON.stringify(response, null, 2));
      return null;
    }
  }
};

const updateString = async (
  projectId: number,
  stringId: number,
  propsToUpdate: { path: string; value: string | boolean }[]
) => {
  const headers = { ...authHeader };
  const endPoint = `projects/${projectId}/strings/${stringId}`;
  const body = propsToUpdate.map(({ path, value }) => ({
    op: "replace",
    path,
    value,
  }));
  await makeRequest<CrowdinStringsPATCH>({
    method: "patch",
    endPoint,
    headers,
    body,
    contentType: "application/json",
  });
};

const changeHiddenStatus = async (
  projectId: number,
  stringId: number,
  newStatus: boolean
) => {
  await updateString(projectId, stringId, [
    { path: "/isHidden", value: newStatus },
  ]);
};

const updateFileStrings = async (
  projectId: number,
  fileId: number,
  challengeTitle: string
) => {
  const fileStrings = await getStrings(projectId, fileId);
  if (!fileStrings) {
    return;
  }
  for (const {
    data: { id: stringId, text, isHidden, context, type },
  } of fileStrings) {
    const hideString = shouldHide(text, context, challengeTitle, type);
    if (!isHidden && hideString) {
      await changeHiddenStatus(projectId, stringId, true);
    } else if (isHidden && !hideString) {
      await changeHiddenStatus(projectId, stringId, false);
    }
  }
};

const updateFileString = async (
  projectId: number,
  string: CrowdinStringsPATCH,
  challengeTitle: string,
  crowdinFilePath: string
) => {
  const {
    data: { id: stringId, text, isHidden, context },
  } = string;
  const hideString = shouldHide(text, context, challengeTitle, crowdinFilePath);
  if (!isHidden && hideString) {
    await changeHiddenStatus(projectId, stringId, true);
    console.log(
      `${challengeTitle} - stringId: ${stringId} - changed isHidden to true`
    );
  } else if (isHidden && !hideString) {
    await changeHiddenStatus(projectId, stringId, false);
    console.log(
      `${challengeTitle} - stringId: ${stringId} - changed isHidden to false`
    );
  }
};

export const CrowdinStringHelper = {
  getStrings,
  shouldHide,
  changeHiddenStatus,
  updateFileString,
  updateFileStrings,
};
