import test from 'node:test';
import assert from 'node:assert/strict';
import {buildStats,buildReviews,localDayKey,learningStreak} from '../app/history.js';
test('missing scores and invalid dates do not create wrong answers or crash streaks',()=>{
 assert.deepEqual(buildStats([{field:1,score:null}]),{});
 assert.deepEqual(buildReviews([{question_id:'x',score:null,created_at:'2026-01-01'},{question_id:'y',score:100,created_at:'invalid'}]),{});
 assert.equal(localDayKey('invalid'),null);
 assert.equal(learningStreak([{created_at:'invalid'}]),0);
});
test('streak uses local calendar days across daylight saving transitions',()=>{
 const previous=process.env.TZ;process.env.TZ='Europe/Berlin';
 try {
  assert.equal(localDayKey('2026-03-28T23:30:00Z'),'2026-03-29');
  const rows=['2026-03-28T12:00:00+01:00','2026-03-29T12:00:00+02:00','2026-03-30T00:30:00+02:00'].map(created_at=>({created_at}));
  assert.equal(learningStreak(rows,new Date('2026-03-30T08:00:00+02:00')),3);
  assert.equal(learningStreak(rows,new Date('2026-03-31T08:00:00+02:00')),3);
  assert.equal(learningStreak(rows,new Date('2026-04-01T08:00:00+02:00')),0);
 } finally {if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
});
