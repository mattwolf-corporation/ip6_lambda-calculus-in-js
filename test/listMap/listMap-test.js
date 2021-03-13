import {TestSuite} from "../test.js";

import {id, beq, True, False, showBoolean as show, convertToJsBool, showPair, pair, triple, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple, not} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, pred, succ, jsNum, is0, churchAddition} from '../../src/lambda-calculus-library/church-numerals.js';
import {
    hasPre, push, pop, head, size, startStack, stack,
    pushToStack, convertArrayToStack, getElementByIndex, map
} from "../../src/stack/stack.js";

import {
    listMap, startListMap, emptyListMap, removeByKey, getElementByKey, mapListMap,
    filterListMap, reduceListMap, convertObjToListMap
}from "../../src/listMap/listMap.js";

const listMapSuite = TestSuite("List Map (pure functional data structure)");

// Test data
const personList = [
    {firstName: 'Peter', lastName: 'Pan', age: 30, income: 1000},
    {firstName: 'Marc', lastName: 'Hunt', age: 28, income: 2000},
    {firstName: 'Luke', lastName: 'Skywalker', age: 36, income: 3000},
    {firstName: 'Han', lastName: 'Solo', age: 55, income: 4000},
    {firstName: 'Tyrion', lastName: 'Lennister', age: 40, income: 5000}
];
Object.freeze(personList);

const p0 = pair(15)(personList[0])
const p1 = pair(16)(personList[1])
const p2 = pair(17)(personList[2])
const p3 = pair(18)(personList[3])
const p4 = pair(19)(personList[4])
const testListMap = convertArrayToStack([p0, p1, p2, p3, p4])

const z1 = pair(15)(5)
const z2 = pair(16)(10)
const z3 = pair(17)(15)
const listMapWithNumbers = convertArrayToStack([z1,z2,z3])

listMapSuite.add("emptyListMap", assert => {
    assert.equals(convertToJsBool(hasPre(emptyListMap)), false);
    assert.equals((pop(emptyListMap))(fst), id);
    assert.pairEquals((pop(emptyListMap))(snd), pair(id)(id));
    assert.equals(size(emptyListMap), n0);
    assert.pairEquals(head(emptyListMap), pair(id)(id));
});


listMapSuite.add("getElementByKey", assert => {
    assert.equals( getElementByKey(testListMap)(15), personList[0]);
    assert.equals( getElementByKey(testListMap)(16), personList[1]);
    assert.equals( getElementByKey(testListMap)(17), personList[2]);
    assert.equals( getElementByKey(testListMap)(18), personList[3]);
    assert.equals( getElementByKey(testListMap)(19), personList[4]);

    assert.equals( getElementByKey(testListMap)(1000), id);
    assert.equals( getElementByKey(testListMap)(-12), id);

    assert.equals( getElementByKey(testListMap)("random"), id);
});

listMapSuite.add("removeByKey", assert => {
    assert.equals( getElementByKey(testListMap)(17), personList[2]);

    assert.churchNumberEquals( size(testListMap), n5);

    assert.pairEquals(getElementByIndex(testListMap)(n1), p0);
    assert.pairEquals(getElementByIndex(testListMap)(n2), p1);
    assert.pairEquals(getElementByIndex(testListMap)(n3), p2);
    assert.pairEquals(getElementByIndex(testListMap)(n4), p3);
    assert.pairEquals(getElementByIndex(testListMap)(n5), p4);

    const listMapUnderTest = removeByKey(testListMap)(17);
    const listMapUnderTest2 = removeByKey(testListMap)("dhfhdfh");
    assert.churchNumberEquals( size(listMapUnderTest2), n5);

    assert.churchNumberEquals( size(listMapUnderTest), n4);

    assert.pairEquals(getElementByIndex(listMapUnderTest)(n1), p0);
    assert.pairEquals(getElementByIndex(listMapUnderTest)(n2), p1);
    assert.pairEquals(getElementByIndex(listMapUnderTest)(n3), p3);
    assert.pairEquals(getElementByIndex(listMapUnderTest)(n4), p4);

    assert.equals( getElementByKey(listMapUnderTest)(17), id);
});

listMapSuite.add("listMap - special keys", assert => {
    const specialKey = () => {};

    const p0 = pair(n4)(personList[0])
    const p1 = pair(id)(personList[1])
    const p2 = pair(n0)(personList[2])
    const p3 = pair(specialKey)(personList[3])
    const p4 = pair(pair)(personList[4])

    const listMapWithSpecialKeys = startListMap
    (pushToStack) ( p0 )
    (pushToStack) ( p1 )
    (pushToStack) ( p2 )
    (pushToStack) ( p3 )
    (pushToStack) ( p4 )
    (id)

    assert.churchNumberEquals( size(listMapWithSpecialKeys), n5);
    assert.pairEquals(getElementByIndex(listMapWithSpecialKeys)(n1), p0);
    assert.pairEquals(getElementByIndex(listMapWithSpecialKeys)(n2), p1);
    assert.pairEquals(getElementByIndex(listMapWithSpecialKeys)(n3), p2);
    assert.pairEquals(getElementByIndex(listMapWithSpecialKeys)(n4), p3);
    assert.pairEquals(getElementByIndex(listMapWithSpecialKeys)(n5), p4);

    assert.equals(getElementByKey(listMapWithSpecialKeys)(n4), personList[0]);
    assert.equals(getElementByKey(listMapWithSpecialKeys)(id), personList[1]);
    assert.equals(getElementByKey(listMapWithSpecialKeys)(n0), personList[2]);
    assert.equals(getElementByKey(listMapWithSpecialKeys)(specialKey), personList[3]);
    assert.equals(getElementByKey(listMapWithSpecialKeys)(pair), personList[4]);

    const r1 = removeByKey(listMapWithSpecialKeys)(n4)
    assert.churchNumberEquals( size(r1), n4);
    assert.equals(getElementByKey(r1)(n4), id);

    // TODO: more tests with removeByKey
});

listMapSuite.add("map", assert => {
    const result = map(p => p(snd).firstName.toUpperCase())(testListMap);

    assert.churchNumberEquals( size(result), n5);
    assert.equals(getElementByIndex(result)(n1), "PETER");
    assert.equals(getElementByIndex(result)(n2), "MARC");
});

listMapSuite.add("mapListMap", assert => {
    const result = mapListMap(p => p.firstName.toUpperCase())(testListMap);

    assert.churchNumberEquals( size(result), n5);
    assert.pairEquals(getElementByIndex(result)(n1), pair(15)("PETER"));
    assert.pairEquals(getElementByIndex(result)(n2), pair(16)("MARC"));
    assert.pairEquals(getElementByIndex(result)(n3), pair(17)("LUKE"));
    assert.pairEquals(getElementByIndex(result)(n4), pair(18)("HAN"));
    assert.pairEquals(getElementByIndex(result)(n5), pair(19)("TYRION"));

    const result2 = mapListMap(num => num * 2)(listMapWithNumbers);

    assert.churchNumberEquals( size(result2), n3);
    assert.pairEquals(getElementByIndex(result2)(n1), pair(15)(10));
    assert.pairEquals(getElementByIndex(result2)(n2), pair(16)(20));
    assert.pairEquals(getElementByIndex(result2)(n3), pair(17)(30));

    const startsWithP = str => str.startsWith('P');
    const listMapWithNames = convertObjToListMap({name1: "Peter", name2: "Hans", name3: "Paul"});
    const filteredListMap = filterListMap(startsWithP)(listMapWithNames);

    const peter = getElementByKey(filteredListMap)("name1");
    const paul = getElementByKey(filteredListMap)("name3");


    assert.churchNumberEquals( size(filteredListMap), n2);
    console.log(peter);
    console.log(paul);
});

listMapSuite.add("filterListMap", assert => {
    const result = filterListMap(p => p.firstName.startsWith('L'))(testListMap);

    assert.churchNumberEquals( size(result), n1);
    assert.pairEquals(getElementByIndex(result)(n1), p2);

    const result2 = filterListMap(num => num >= 7)(listMapWithNumbers);

    assert.churchNumberEquals( size(result2), n2);
    assert.pairEquals(getElementByIndex(result2)(n1), pair(16)(10));
    assert.pairEquals(getElementByIndex(result2)(n2), pair(17)(15));
});

listMapSuite.add("reduceListMap", assert => {
    const result = reduceListMap((acc, curr) => acc + curr.income)(0)(testListMap);
    assert.equals( result, 15000);

    const result2 = reduceListMap((acc, curr) => acc + curr)(0)(listMapWithNumbers);
    assert.equals(result2, 30)
});

listMapSuite.add("convert Object to ListMap", assert => {
    const obj = {a: 'HelloWorld', b: "Lambda"}

    const result = convertObjToListMap(obj);

    assert.churchNumberEquals( size(result), n2);
    assert.pairEquals( getElementByIndex(result)(n1), pair('a')("HelloWorld"));
    assert.pairEquals( getElementByIndex(result)(n2), pair('b')("Lambda"));



    const objWithObject = {
        a: {
            txt: 'HelloWorld',
            short: 'HW'
        },
        b: {
            txt: 'Lambda',
            short: 'λ'
        }
    }

    const result2 = convertObjToListMap(objWithObject);

    assert.churchNumberEquals( size(result2), n2);
    assert.equals( getElementByIndex(result2)(n1)(fst), "a")
    assert.equals( JSON.stringify(getElementByIndex(result2)(n1)(snd)), JSON.stringify({txt: 'HelloWorld',short: 'HW' }) )
    assert.equals( getElementByIndex(result2)(n2)(fst), "b")
    assert.equals( JSON.stringify(getElementByIndex(result2)(n2)(snd)), JSON.stringify({txt: 'Lambda',short: 'λ' }) )
});

listMapSuite.add("playground", assert => {
    const personObject = {firstName: 'George', lastName: "Lucas"}

    const result = convertObjToListMap(personObject);

    const firstName   = getElementByKey (result) ("firstName"); // "George"
    const lastName    = getElementByKey (result) ("lastName");  // "Lucas"

    console.log('f ' + firstName);
    console.log('l ' + lastName);
});

listMapSuite.report();
