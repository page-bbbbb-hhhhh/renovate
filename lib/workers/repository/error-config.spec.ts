import { mock } from 'jest-mock-extended';
import { RenovateConfig, getConfig, platform } from '../../../test/util';
import { CONFIG_VALIDATION } from '../../constants/error-messages';
import { Pr } from '../../platform';
import { PrState } from '../../types';
import { raiseConfigWarningIssue } from './error-config';

jest.mock('../../platform');

let config: RenovateConfig;
beforeEach(() => {
  jest.resetAllMocks();
  config = getConfig();
});

describe('workers/repository/error-config', () => {
  describe('raiseConfigWarningIssue()', () => {
    it('creates issues', async () => {
      const error = new Error(CONFIG_VALIDATION);
      error.configFile = 'package.json';
      error.validationMessage = 'some-message';
      platform.ensureIssue.mockResolvedValueOnce('created');
      const res = await raiseConfigWarningIssue(config, error);
      expect(res).toBeUndefined();
    });
    it('creates issues (dryRun)', async () => {
      const error = new Error(CONFIG_VALIDATION);
      error.configFile = 'package.json';
      error.validationMessage = 'some-message';
      platform.ensureIssue.mockResolvedValueOnce('created');
      const res = await raiseConfigWarningIssue(
        { ...config, dryRun: true },
        error
      );
      expect(res).toBeUndefined();
    });
    it('handles onboarding', async () => {
      const error = new Error(CONFIG_VALIDATION);
      error.configFile = 'package.json';
      error.validationMessage = 'some-message';
      platform.getBranchPr.mockResolvedValue({
        ...mock<Pr>(),
        number: 1,
        state: PrState.Open,
      });
      const res = await raiseConfigWarningIssue(config, error);
      expect(res).toBeUndefined();
    });
    it('handles onboarding (dryRun)', async () => {
      const error = new Error(CONFIG_VALIDATION);
      error.configFile = 'package.json';
      error.validationMessage = 'some-message';
      platform.getBranchPr.mockResolvedValue({
        ...mock<Pr>(),
        number: 1,
        state: PrState.Open,
      });
      const res = await raiseConfigWarningIssue(
        { ...config, dryRun: true },
        error
      );
      expect(res).toBeUndefined();
    });
  });
});
