import path from 'path';
import LintingMixin from '../linting/index.js';
import BuildingMixin from '../building/index.js';
import TestingMixin from '../testing/index.js';
import { askTagInfo } from '../../helpers.js';

const StarterAppMixin = subclass =>
  class extends BuildingMixin(TestingMixin(LintingMixin(subclass))) {
    async execute() {
      // before super to also affect the Mixin it applies
      let tagName = '';
      let className = '';

      if(process.argv[3]) {
        tagName = process.argv[3];
        className = process.argv[3].replace(/-([a-z])/g, g => g[1].toUpperCase()).replace(/^\w/, c => c.toUpperCase());
      } else {
        ({ tagName, className } = await askTagInfo());
      }

      this.templateData = { ...this.templateData, tagName, className };
      this._destinationPath = path.join(process.cwd(), tagName);

      console.log('Setup Starter App...');
      await super.execute();

      // write & rename app-template
      this.copyTemplate(
        `${__dirname}/templates/_app.js`,
        this.destinationPath(`src/${tagName}.js`),
      );

      // write & rename test-template
      this.copyTemplate(
        `${__dirname}/templates/_test.js`,
        this.destinationPath(`test/${tagName}.test.js`),
      );

      this.copyTemplateJsonInto(
        `${__dirname}/templates/_package.json`,
        this.destinationPath('package.json'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);
    }

    async end() {
      await super.end();
      console.log('');
      console.log('You are all set up now!');
      console.log('');
      console.log('All you need to do is run:');
      console.log(`  cd ${this.templateData.tagName}`);
      console.log('  npm run start');
      console.log('');
    }
  };

export default StarterAppMixin;
