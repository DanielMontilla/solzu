import '../index';
import { test, expect } from 'vitest';

test('[@rust types] Results workflow', () => {
  const task = (outcome: 'success' | 'fail'): Result<boolean> => {
    switch (outcome) {
      case 'success':
        return ok(true);
      case 'fail':
        return err('')
    }
  }

  const emptyTask = (outcome: 'success' | 'fail'): EmptyResult => {
    switch (outcome) {
      case 'success':
        return ok();
      case 'fail':
        return err('')
    }
  }

  const typedTask = (outcome: 'success' | 'fail'): Result<boolean, 'err 1' | 'err 2' | 'err 3'> => {
    switch (outcome) {
      case 'success':
        return ok(false);
      case 'fail':
        
        return err('err 1')
    }
  }
});