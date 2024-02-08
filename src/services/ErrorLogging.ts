import uniqid from 'uniqid';
import { format } from 'date-fns';
import { store } from '@store';
import { FrontendErrorType } from '@enums';
import { FrontendError, FrontendErrorRequest } from '@types';
import { API, checkIsDevelopmentMode } from '@utils';
import { CONSOLE_EXCLUDED_ERROR_FRAGMENTS } from '@constants';

class ErrorLoggingService {
  private hasCritical: boolean = false;
  private controller;
  private errors: FrontendErrorRequest[] = [];

  async catch(type: FrontendErrorType, error: { [key: string]: number | string | undefined } | Error) {
    const transformedError = this.transformError(type, error);

    if (this.checkIsErrorInExceptionList(transformedError)) return;

    this.errors.push(transformedError);
    this.send();
  }

  async send() {
    let errorsToSend: FrontendError[] = [];

    if (this.errors.length > 5) {
      this.hasCritical = true;
    }

    if (store.getState().system.networkConnection.isOffline) return;

    if (this.shouldSendErrors()) errorsToSend = [...errorsToSend, ...this.errors];

    if (errorsToSend.length) {
      this.abortController();
      this.controller = new AbortController();
      await API.post('/pm/public/js-errors', errorsToSend, {
        signal: this.controller.signal,
      }).then(() => {
        this.errors = [];
      });
    }
  }

  checkIsErrorInExceptionList(error: FrontendError) {
    return CONSOLE_EXCLUDED_ERROR_FRAGMENTS.reduce((res, fragment) => {
      if (!error.message) return res;
      return !res ? error.message.toString().includes(fragment) : res;
    }, false);
  }

  private abortController() {
    if (this.controller && this.controller.signal) {
      this.controller.abort();
    }
  }

  private transformError(type: FrontendErrorType, error: FrontendError): FrontendErrorRequest {
    const keys = Object.getOwnPropertyNames(error);
    const errorMessage = [
      `type: ${type}`,
      ...this.getUserData(),
      ...keys.filter((key) => error[key]).map((key) => `${key}: ${error[key].toString()}`),
    ].join(' | ');

    return {
      id: this.generateId(),
      path: this.getErrorPath(),
      message: errorMessage,
    };
  }

  private shouldSendErrors() {
    return !this.hasCritical && !checkIsDevelopmentMode() && !location.hostname.includes('localhost');
  }

  private getUserData(): string[] {
    const user = store.getState().user.user;
    if (!user) return [];
    return [
      `userId: ${user.id || 'NULL'}`,
      `branchId: ${user.currentBranchId || 'NULL'}`,
      `organizationId: ${user.currentOrganizationId || 'NULL'}`,
    ];
  }

  private getErrorPath() {
    return location.href;
  }

  private generateId() {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const formattedDate = format(currentDate, 'dd-MM-yyyy');
    return `${formattedDate}/${timestamp}/${uniqid()}`;
  }
}

export const ErrorLogging = new ErrorLoggingService();
