import {jsnum} from "../src/lambda-calculus-library/church-numerals.js";

export {TestSuite}

const Assert = () => {
    let counter = 1;
    const ok = [];
    const equals = (actual, expected) => {
        const result = (actual === expected);
        addTest(actual, expected, result);
    };

    const churchNumberEquals = (actual, expected) => {
        const result = (jsnum(actual) === jsnum(expected));
        addTest(actual, expected, result);
    };

    const addTest = (actual, expected, result) =>{
        ok.push({actual, expected, result, counter});
        counter++;
    };


    return {
        getOk: () => ok,
        equals: equals,
        churchNumberEquals: churchNumberEquals
    }
};

const TestSuite = name => {
    const tests = [];
    const add = (origin, callback) => {
        const assert = Assert();          //    das ok anlegen
        callback(assert);
        tests.push({
            origin,
            asserts: [...assert.getOk()]
        });
    };

    const report = () => {
        renderReport(name, tests);
    };

    return {
        add: add,
        report: report
    }

};


function renderReport(name, tests) {
    let outputHtml = "";

    let totalPassed = 0;
    let totalFailed = 0;

    tests.forEach(test => {
        const {origin, asserts} = test;

        const failed = asserts.filter(testResult => !testResult.result);
        const passed = asserts.length - failed.length;

        totalPassed += passed;
        totalFailed += failed.length;

        let resultLine = "";
        let passedLine = ` <span> - Passed: ${passed} / ${asserts.length} <span class="dot green"></span> </span>`;

        failed.forEach(failedTest => {
            const {actual, expected, result, counter} = failedTest;
            resultLine += `<p><span class="dot red"></span>Test Nr.  <b>${counter} </b> failed: not equal! actual was ${actual} but expected ${expected}</p>`;
        });

        outputHtml += `
            <h4> ${origin} ${passedLine} </h4>
            <div class="testContainer">
                ${resultLine}
            </div>
        `;
    });

    const output = document.getElementById("output");
    output.insertAdjacentHTML("beforeend",
        `<fieldset style="border-color: ${totalFailed > 0 ? 'red' : 'green'}">
                <legend>${name}</legend>
                     ${outputHtml}
                     
                     <h5>Total passed: ${totalPassed}   failed: ${totalFailed} </h5>
                </fieldset>`
    );
}