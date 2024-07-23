const { createDriver } = require('../utils/webdriver');
const testData = require('../data/testData');
const RetirementCalculatorPage = require('../pageobjects/RetirementCalculatorPage');

import { expect } from 'chai';

describe('Retirement Calculator', () => {
    it('should calculate retirement with valid data', async () => {
        // User opens the retirement calculator page
        await RetirementCalculatorPage.open();

        // User fills up the retirement calculator form with valid data
        await RetirementCalculatorPage.fillRetirementForm(testData.retirementForm);

        // User clicks on the calculate button to see the results
        await RetirementCalculatorPage.clickCalculate();

        // User should see the retirement calculator chart displaying the calculated results based on the valid input data
        const resultChart = await RetirementCalculatorPage.getResultChart();
        
        // Assert that the result chart is displayed
        expect(await resultChart.isDisplayed()).to.be.true; 
        
        // Assert that the calculated values match the expected results
        const calculatedValues = await RetirementCalculatorPage.getCalculatedValues();
        expect(calculatedValues.totalSavingsAtRetirement).to.equal(testData.expectedValues.totalSavingsAtRetirement);
        expect(calculatedValues.annualIncomePostRetirement).to.equal(testData.expectedValues.annualIncomePostRetirement);
    });

    it('should show validation errors with invalid data', async () => {
        // User opens the retirement calculator page
        await RetirementCalculatorPage.open();

        // User fills up the retirement calculator form with invalid data (e.g., negative age)
        const invalidData = { ...testData.retirementForm, currentAge: -1 };
        await RetirementCalculatorPage.fillRetirementForm(invalidData);

        // User clicks on the calculate button
        await RetirementCalculatorPage.clickCalculate();

        // User should see validation error messages indicating that the provided data is incorrect or not allowed
        const validationErrors = await RetirementCalculatorPage.getValidationErrors();
        
        // Assert that validation errors are displayed and include the expected error message
        expect(validationErrors).to.include('Current age must be a positive number'); 
    });

    it('should adjust default values and calculate', async () => {
        // User opens the retirement calculator page
        await RetirementCalculatorPage.open();

        // User clicks on the adjust default values button to modify default settings
        await RetirementCalculatorPage.clickAdjustDefaultValues();

        const defaultValues = await RetirementCalculatorPage.getDefaultValues();
        expect(defaultValues.inflationRate).to.equal(testData.defaultValues.inflationRate);
        expect(defaultValues.investmentReturn).to.equal(testData.defaultValues.investmentReturn);
        expect(defaultValues.retirementYears).to.equal(testData.defaultValues.retirementYears);

        await RetirementCalculatorPage.fillRetirementForm(testData.retirementForm);
    
        // User clicks on the calculate button to apply the adjusted values
        await RetirementCalculatorPage.clickCalculate();

        // User should see the updated results based on the adjusted default values
        const resultChart = await RetirementCalculatorPage.getResultChart();

        // Assert that the result chart is displayed
        expect(await resultChart.isDisplayed()).to.be.true;

        // Assert that the calculated values match the expected results after adjusting default values
        const calculatedValues = await RetirementCalculatorPage.getCalculatedValues();
        expect(calculatedValues.totalSavingsAtRetirement).to.equal(testData.expectedDefaultValues.totalSavingsAtRetirement);
        expect(calculatedValues.annualIncomePostRetirement).to.equal(testData.expectedDefaultValues.annualIncomePostRetirement);
    });
});
