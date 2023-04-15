import { exec } from "child_process";
import { promisify } from "util";

import { getOctokit } from "@actions/github";

/**
 * Module to create a pull request.
 *
 * @param {string} token The GitHub token for the account that is creating a PR.
 * @param {string} branch The name of the branch to create a PR from.
 * @param {string} repository The name of the repository to create a PR for - follow "owner/repo" syntax.
 * @param {string} base The name of the branch to target with the PR (probably `main`).
 * @param {string} title The title of the PR.
 * @param {string} body The body of the PR.
 * @param {string} labels A comma-separated list of labels to apply to the PR.
 * @param {string} reviewers A comma-separated list of GitHub usernames to request review from.
 * @param {string} teamReviewers A comma-separated list of GitHub team names to request review from.
 * @returns {boolean} Whether or not the PR was created successfully.
 */
export const createPullRequest = async (
  token: string,
  branch: string,
  repository: string,
  base = "main",
  title: string,
  body: string,
  labels?: string,
  reviewers?: string,
  teamReviewers?: string
) => {
  try {
    const asyncExec = promisify(exec);
    const parsedLabels = labels ? labels.split(/,\s+/) : [];
    const parsedReviewers = reviewers ? reviewers.split(/,\s+/) : [];
    const parsedTeamReviewers = teamReviewers
      ? teamReviewers.split(/,\s+/)
      : [];
    const [owner, repo] = repository.split("/");

    if (!owner || !repo) {
      return false;
    }

    const githubClient = getOctokit(token);

    const doesBranchExist = await githubClient.rest.repos
      .getBranch({ owner, repo, branch })
      .catch(() => console.info("Branch does not exist."));

    if (!doesBranchExist || doesBranchExist.status !== 200) {
      return false;
    }

    const pullRequestExists = await githubClient.rest.pulls.list({
      owner,
      repo,
      head: `${owner}:${branch}`,
    });

    if (pullRequestExists.data.length) {
      console.info(
        `It looks like pull request ${pullRequestExists.data[0].number} already exists.`
      );
      // we want to exit successfully as this isn't a failure condition.
      return true;
    }

    const { stdout: currentBranch } = await asyncExec("git rev-parse HEAD");
    const { stdout: baseBranch } = await asyncExec(`git rev-parse ${base}`);

    if (currentBranch === baseBranch) {
      console.info("Nothing was committed, no PR will be created.");
      return true;
    }

    const pullRequest = await githubClient.rest.pulls
      .create({
        owner,
        repo,
        head: branch,
        base,
        title,
        body,
      })
      .catch((err) => {
        console.info("Attempt to create the PR failed:");
        console.error(err);
      });
    if (!pullRequest || pullRequest.status !== 201) {
      return false;
    }

    const pullNumber = pullRequest.data.number;
    console.log(
      `https://github.com/${owner}/${repo}/pull/${pullNumber} created!`
    );

    if (parsedLabels && parsedLabels.length) {
      await githubClient.rest.issues.addLabels({
        owner,
        repo,
        // eslint-disable-next-line camelcase
        issue_number: pullNumber,
        labels: parsedLabels,
      });
      console.log(`Labels ${parsedLabels.join(", ")} added to PR.`);
    }

    if (parsedReviewers && parsedReviewers.length) {
      await githubClient.rest.pulls.requestReviewers({
        owner,
        repo,
        // eslint-disable-next-line camelcase
        pull_number: pullNumber,
        reviewers: parsedReviewers,
      });
      console.log(`Reviewers ${parsedReviewers.join(", ")} added to PR.`);
    }

    if (parsedTeamReviewers && parsedTeamReviewers.length) {
      await githubClient.rest.pulls.requestReviewers({
        owner,
        repo,
        // eslint-disable-next-line camelcase
        pull_number: pullNumber,
        // eslint-disable-next-line camelcase
        team_reviewers: parsedTeamReviewers,
      });
      console.log(
        `Team Reviewers ${parsedTeamReviewers.join(", ")} added to PR.`
      );
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
