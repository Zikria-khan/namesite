const fs = require('fs');
const path = require('path');

const islamic = JSON.parse(fs.readFileSync(path.join('C:/code/nameverse/public/islamic_names.json'), 'utf8'));
const christian = JSON.parse(fs.readFileSync(path.join('C:/code/nameverse/public/christians_names.json'), 'utf8'));
const hindu = JSON.parse(fs.readFileSync(path.join('C:/code/nameverse/public/hindu_names.json'), 'utf8'));

function checkNames(names, arr, label) {
  const found = names.filter(n => arr.includes(n));
  const missing = names.filter(n => !arr.includes(n));
  console.log(`\n${label} - FOUND (${found.length}): ${found.join(', ')}`);
  if (missing.length > 0) console.log(`MISSING (${missing.length}): ${missing.join(', ')}`);
}

// Islamic
const islamicNames = ["Muhammad","Abdullah","Ali","Ahmed","Omar","Yusuf","Ibrahim","Adam","Isa","Musa","Hassan","Hussein","Zain","Rayan","Khalid","Tariq","Hamza","Bilal","Saad","Faris","Zayd","Malik","Amir","Karim","Suleiman","Harun","Dawood","Nuh","Aisha","Fatima","Maryam","Khadija","Zainab","Hafsa","Safiya","Nour","Layla","Yasmin","Amira","Salma","Inaya","Zara","Amina","Aaliya","Hana","Sara","Ayesha","Sumaiya","Rehan","Aliya"];
checkNames(islamicNames, islamic, 'ISLAMIC');

// Christian
const christianNames = ["Abraham","Aaron","Adam","Benjamin","Daniel","David","Elias","Elijah","Gabriel","Isaac","Jacob","James","John","Joseph","Joshua","Luke","Mark","Matthew","Michael","Nathaniel","Noah","Peter","Samuel","Solomon","Thomas","Timothy","Zachary","Andrew","Anthony","Christopher","George","Edward","William","Robert","Charles","Henry","Frederick","Albert","Archibald","Bartholomew","Clement","Cyril","Eustace","Gregory","Hilary","Ignatius","Jerome"];
checkNames(christianNames, christian, 'CHRISTIAN');

// Christian girls
const christianGirls = ["Abigail","Anna","Bethany","Catherine","Christina","Elizabeth","Emily","Eve","Grace","Hannah","Isabella","Jane","Jessica","Lily","Mary","Martha","Rebecca","Ruth","Sarah","Sophia","Alice","Beatrice","Clara","Dorothy","Eleanor","Florence","Helen","Margaret","Victoria","Augusta","Benedicta","Carina","Cecilia","Diana","Esther","Faith","Hope","Joy","Mercy","Patience","Prudence","Temperance"];
checkNames(christianGirls, christian, 'CHRISTIAN GIRLS');

// Hindu
const hinduBoys = ["Aryan","Arjun","Aditya","Krishna","Rahul","Rohit","Vikram","Aarav","Advait","Vihaan","Karthik","Shiv","Rishi","Arnav","Vivaan","Dhruv","Siddharth","Kabir","Ishaan","Ayaan","Vedant","Aryan","Aarush","Anay","Vansh","Atharv","Lakshay","Manav","Parth","Reyansh"];
checkNames(hinduBoys, hindu, 'HINDU BOYS');

const hinduGirls = ["Aadhya","Ananya","Diya","Saanvi","Isha","Kavya","Meera","Priya","Riya","Sneha","Tara","Pooja","Anika","Avni","Amrita","Nitya","Veda","Sara","Arya","Aarohi","Advika","Ahana","Akshara","Disha","Janvi","Mahika","Navya","Pari","Samaira","Trisha"];
checkNames(hinduGirls, hindu, 'HINDU GIRLS');
