import { memberServices } from '../services/memberService';

test('memberServices.getAll existe y es función', () => {
  expect(typeof memberServices.getAll).toBe('function');
}); 