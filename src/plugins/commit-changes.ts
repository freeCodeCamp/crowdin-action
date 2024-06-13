import { exec } from "child_process";
import { promisify } from "util";

/**
 * Module to stage all current changes except the crowdin-config.yml file and
 * commit them to a designated branch name.
 *
 * @param {string} username The GitHub username to commit from.
 * @param {string} email The GitHub email to commit from.
 * @param {string} branchName The name of the branch to commit to.
 * @param {string} commitMessage The commit message to use.
 * @param {string} cwd The current working directory to execute commands in.
 */
export const commitChanges = async (
  username: string,
  email: string,
  branchName: string,
  commitMessage: string,
  cwd?: string
) => {
  const asyncExec = promisify(exec);
  const options = cwd ? { cwd } : {};

  await asyncExec(`git config --global user.name ${username}`, options);
  await asyncExec(`git config --global user.email ${email}`, options);
  await asyncExec(`git checkout -b ${branchName}`, options);
  await asyncExec("git add .", options);
  await asyncExec("git reset crowdin-config.yml", options);
  await asyncExec(
    `git diff-index --quiet HEAD || git commit -m "${commitMessage}"`,
    options
  );
  await asyncExec(`git push -u origin ${branchName} -f`, options);
};
