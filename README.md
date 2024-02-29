# Crowdin Github Actions

This repository holds all of our tooling for the Crowdin integration. This allows us to manage multiple repositories and projects without having to duplicate tooling, and maintain a single source of truth for the configuration objects.

## Required Environment Variables

The following environment variables are required to be set in order to run the actions, regardless of which plugin is chosen.

`CROWDIN_PERSONAL_TOKEN`, `CROWDIN_API_URL`, `PROJECT_ID`, and `PLUGIN`. Note that `PLUGIN` should match one of the options below.

## Plugins

The action is designed to be modular, with multiple plugins to choose from for each step. The plugins and environment variables are as follows:

| Plugin                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                           | Environment Variables                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `check-paths`             | Prints the current process directory and contents. See [File Structure](#file-structure)                                                                                                                                                                                                                                                                                                                                              | none                                                        |
| `commit-changes`          | This plugin creates a commit with all changed files, except for the `crowdin-config.yml`.                                                                                                                                                                                                                                                                                                                                             | `GH_USERNAME`, `GH_EMAIL`, `GH_BRANCH`, `GH_MESSAGE`        |
| `convert-chinese`         | This plugin copies the Simplified Chinese translations to Traditional Chinese. The file path should be `/some/folders/chinese`, and the result will be `/some/folders/chinese-traditional`. Note that `FILE_PATHS` should be a stringified array, as GitHub `yaml` doesn't accept array values: `'["curriculum/challenges/chinese", "curriculum/dictionaries/chinese"]'`. Set `USE_LANG_CODES` to `true` to do `zh -> zh-TW` instead. | `FILE_PATHS`, `USE_LANG_CODE`                               |
| `generate-config`         | This looks at the `PROJECT_NAME` value and finds the matching configuration file in `/src/configs`, then copies it to the current directory as `crowdin-config.yml`.                                                                                                                                                                                                                                                                  | `PROJECT_NAME`                                              |
| `hide-curriculum-strings` | This plugin runs through all of the strings in the specified project and hides them if they meet specific conditions.                                                                                                                                                                                                                                                                                                                 | none                                                        |
| `hide-renpy-strings`      | This plugin runs through all of the strings in the specified project and hides them if they meet specific conditions.                                                                                                                                                                                                                                                                                                                 | none                                                        |
| `hide-string`             | Looks for a specific string in a specific file and marks it as hidden.                                                                                                                                                                                                                                                                                                                                                                | `FILE_NAME`, `STRING_CONTENT`                               |
| `lowercase-directories`   | This plugin will walk through the `FILE_PATH` directory and make sure all sub-directories are set to lowercase                                                                                                                                                                                                                                                                                                                         | `FILE_PATHS`                                                |                                      |
| `pull-request`            | Creates a pull request from the specified branch and targets the specified base, or main by default.                                                                                                                                                                                                                                                                                                                                  | `GH_TOKEN`, `BRANCH`, `REPOSITORY`, `BASE`, `TITLE`, `BODY` |
| `remove-deleted-files`    | This will recursively walk through the `FILE_PATHS` directories and remove any files from Crowdin that are no longer present in the repo. Note that `FILE_PATHS` should be a stringified array, as GitHub `yaml` doesn't accept array values: `'["curriculum/challenges/english", "curriculum/dictionaries/english"]'`                                                                                                                | `FILE_PATHS`                                                |
| `unhide-string`           | Looks for a specific string in a specific file and marks it as visible.                                                                                                                                                                                                                                                                                                                                                               | `FILE_NAME`, `STRING_CONTENT`                               |

Refer to [`action.yml`](./action.yml) for more information on the environment variables.

## Example Usage

Here is an example step in an action file which uses this package:

```yml
- name: Generate Crowdin Config
  uses: nhcarrigan/crowdin-action@main
  env:
    CROWDIN_PERSONAL_TOKEN: ${{ secrets.CROWDIN_PERSONAL_TOKEN }}
    CROWDIN_API_URL: "https://nhcarrigan.crowdin.com/api/v2/"
    CROWDIN_PROJECT_ID: ${{ secrets.CROWDIN_PROJECT_ID_CURRICULUM }}
    PLUGIN: "generate-config"
    PROJECT_NAME: "client"
```

## Making Changes

Any PR that is submitted to make changes to the action code (within `src`) must also include the distribution build. You can generate the distribution build by running `npm run package`, which will bundle all of the code into a single file and save it as `/dist/index.js`. The actions runner relies on this file to avoid having to install dependencies.
