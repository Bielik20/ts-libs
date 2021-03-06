/**
 * A method which is used by semantic releases as script execution.
 * This is loaded and injected by semantic itself.
 */
export type SemanticMethod = (
  config: SemanticOptions,
  context: SemanticContext
) => any;

export interface SemanticContext {
  /** The semantic release configuration itself. */
  options?: SemanticOptions;
  /** The previous release details. */
  lastRelease?: LastRelease;
  /** The next release details. */
  nextRelease?: NextRelease;
  /** The shared logger instance of semantic release. */
  logger: {
    info: (message: string, ...vars: any[]) => void;
    error: (message: string, ...vars: any[]) => void;
  };
  errors?: Error[];
  branch: SemanticBranch;
  branches: unknown[];
  /**
   * Not available in Verify Conditions step
   */
  commits?: SemanticCommit[];
  releases: unknown[];
  cwd: string;
  env: Record<string, string>;
  envCi: {
    isCi: boolean;
    commit: string;
    branch: string;
  };
}

/**
 * The semantic release configuration itself.
 */
export type SemanticOptions = Record<string, string | boolean> & {
  /** The Git repository URL, in any supported format. */
  repositoryUrl: string;
  /** The Git tag format used by semantic-release to identify releases. */
  tagFormat: string;
  dryRun: boolean;
  noCi: boolean;
};

export interface LastRelease {
  version: string;
  gitTag: string;
  gitHead: string;
  channels: (string | null)[];
  name: string;
}

export interface NextRelease {
  type: string;
  channel: string | null;
  gitHead: string;
  version: string;
  gitTag: string;
  name: string;
  notes: string;
}

export interface SemanticBranch {
  channel: undefined | string;
  tags: string[];
  type: 'release' | 'prerelease';
  name: string;
  range: string;
  accept: ('patch' | 'minor' | 'major')[];
  main: boolean;
}

export interface SemanticCommit {
  commit: CommitOrTree;
  tree: CommitOrTree;
  author: AuthorOrCommitter;
  committer: AuthorOrCommitter;
  subject: string;
  body: string;
  hash: string;
  committerDate: Date;
  message: string;
  gitTags: string;
}

interface CommitOrTree {
  long: string;
  short: string;
}

interface AuthorOrCommitter {
  name: string;
  email: string;
  date: Date;
}
