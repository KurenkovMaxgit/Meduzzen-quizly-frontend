import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: 'http://localhost:8080/api-docs-json',
  apiFile: './src/lib/quizlyApi.ts',
  apiImport: 'quizlyApi',
  outputFile: './src/lib/generatedApi.ts',
  exportName: 'quizlyApi',
  hooks: true,
};

export default config;
