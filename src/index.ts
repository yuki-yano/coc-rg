import { CompleteResult, ExtensionContext, sources } from 'coc.nvim';
import { execSync } from 'child_process';

export const activate = async (context: ExtensionContext): Promise<void> => {
  context.subscriptions.push(
    sources.createSource({
      name: 'rg',
      doComplete: async ({ input }) => {
        return await getCompletionItems({ input: input.replace(/([\\\[\]^$.*])/g, '\\$1') });
      },
    })
  );
};

const options = [
  '--no-filename',
  '--no-heading',
  '--no-line-number',
  '--color=never',
  '--only-matching',
  '--word-regexp',
  '--ignore-case',
];

const getCompletionItems = async ({ input }: { input: string }): Promise<CompleteResult> => {
  input = input.replace(/^-+/, '')

  if (input.length < 2) {
    return { items: [] };
  }

  const stdout: string = execSync(`rg ${options.join(' ')} ${input}[a-zA-Z0-9_-]+ ${process.cwd()}`, {
    encoding: 'utf-8',
    maxBuffer: 1024 * 1024 * 1000,
  });

  return {
    items: stdout.split('\n').map((word) => ({ word, menu: '[rg]' })),
  };
};
