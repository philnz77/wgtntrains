import {formatInNzIso, getTripStopTimeDate} from '../app/utils';
 
describe('getTripStopTimeDate', () => {
  it('handles normal case', () => { 
    expect(formatInNzIso(getTripStopTimeDate("20230514", "20:58:00"))).toEqual("2023-05-14T20:58:00");
  });
  it('handles after midnight', () => { 
    expect(formatInNzIso(getTripStopTimeDate("20230514", "24:58:00"))).toEqual("2023-05-15T00:58:00");
  });
});