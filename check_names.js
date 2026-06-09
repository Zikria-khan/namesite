const fs = require('fs');

const isl = require('./public/islamic_names.json');
const chr = require('./public/christians_names.json');
const hin = require('./public/hindu_names.json');

// Lowercase for search
const islLower = new Set(isl.map(n => String(n).toLowerCase()));
const chrLower = new Set(chr.map(n => String(n).toLowerCase()));
const hinLower = new Set(hin.map(n => String(n).toLowerCase()));

const names = ['adam','liam','ethan','atlas','cedar','freya','helena','jasper','marcus','morrigan','oscar','raven','noor','aarya','aahana','krishna','sara','zara'];
names.forEach(n => {
  const lc = n.toLowerCase();
  console.log(`${n}: islamic=${islLower.has(lc)} christian=${chrLower.has(lc)} hindu=${hinLower.has(lc)}`);
});
