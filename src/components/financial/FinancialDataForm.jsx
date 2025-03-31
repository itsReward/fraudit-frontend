import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createFinancialData, updateFinancialData, calculateDerivedValues } from '../../api/financial';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';

const FinancialDataForm = ({ statementId, initialData, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('income');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const isEditing = !!initialData?.id;

    // Validation schema
    const validationSchema = Yup.object({
        // Only validate non-empty fields, as many fields are optional
        revenue: Yup.number().nullable().typeError('Must be a number'),
        costOfSales: Yup.number().nullable().typeError('Must be a number'),
        grossProfit: Yup.number().nullable().typeError('Must be a number'),
        operatingExpenses: Yup.number().nullable().typeError('Must be a number'),
        operatingIncome: Yup.number().nullable().typeError('Must be a number'),
        netIncome: Yup.number().nullable().typeError('Must be a number'),
        totalCurrentAssets: Yup.number().nullable().typeError('Must be a number'),
        totalAssets: Yup.number().nullable().typeError('Must be a number'),
        totalCurrentLiabilities: Yup.number().nullable().typeError('Must be a number'),
        totalLiabilities: Yup.number().nullable().typeError('Must be a number'),
        totalEquity: Yup.number().nullable().typeError('Must be a number'),
    });

    // Initialize form
    const formik = useFormik({
        initialValues: {
            // Income Statement
            revenue: initialData?.revenue || '',
            costOfSales: initialData?.costOfSales || '',
            grossProfit: initialData?.grossProfit || '',
            operatingExpenses: initialData?.operatingExpenses || '',
            administrativeExpenses: initialData?.administrativeExpenses || '',
            sellingExpenses: initialData?.sellingExpenses || '',
            depreciation: initialData?.depreciation || '',
            amortization: initialData?.amortization || '',
            operatingIncome: initialData?.operatingIncome || '',
            interestExpense: initialData?.interestExpense || '',
            otherIncome: initialData?.otherIncome || '',
            earningsBeforeTax: initialData?.earningsBeforeTax || '',
            incomeTax: initialData?.incomeTax || '',
            netIncome: initialData?.netIncome || '',

            // Balance Sheet - Assets
            cash: initialData?.cash || '',
            shortTermInvestments: initialData?.shortTermInvestments || '',
            accountsReceivable: initialData?.accountsReceivable || '',
            inventory: initialData?.inventory || '',
            otherCurrentAssets: initialData?.otherCurrentAssets || '',
            totalCurrentAssets: initialData?.totalCurrentAssets || '',
            propertyPlantEquipment: initialData?.propertyPlantEquipment || '',
            accumulatedDepreciation: initialData?.accumulatedDepreciation || '',
            intangibleAssets: initialData?.intangibleAssets || '',
            longTermInvestments: initialData?.longTermInvestments || '',
            otherNonCurrentAssets: initialData?.otherNonCurrentAssets || '',
            totalNonCurrentAssets: initialData?.totalNonCurrentAssets || '',
            totalAssets: initialData?.totalAssets || '',

            // Balance Sheet - Liabilities
            accountsPayable: initialData?.accountsPayable || '',
            shortTermDebt: initialData?.shortTermDebt || '',
            accruedLiabilities: initialData?.accruedLiabilities || '',
            otherCurrentLiabilities: initialData?.otherCurrentLiabilities || '',
            totalCurrentLiabilities: initialData?.totalCurrentLiabilities || '',
            longTermDebt: initialData?.longTermDebt || '',
            deferredTaxes: initialData?.deferredTaxes || '',
            otherNonCurrentLiabilities: initialData?.otherNonCurrentLiabilities || '',
            totalNonCurrentLiabilities: initialData?.totalNonCurrentLiabilities || '',
            totalLiabilities: initialData?.totalLiabilities || '',

            // Balance Sheet - Equity
            commonStock: initialData?.commonStock || '',
            additionalPaidInCapital: initialData?.additionalPaidInCapital || '',
            retainedEarnings: initialData?.retainedEarnings || '',
            treasuryStock: initialData?.treasuryStock || '',
            otherEquity: initialData?.otherEquity || '',
            totalEquity: initialData?.totalEquity || '',

            // Cash Flow
            netCashFromOperating: initialData?.netCashFromOperating || '',
            netCashFromInvesting: initialData?.netCashFromInvesting || '',
            netCashFromFinancing: initialData?.netCashFromFinancing || '',
            netChangeInCash: initialData?.netChangeInCash || '',

            // Market Data
            marketCapitalization: initialData?.marketCapitalization || '',
            sharesOutstanding: initialData?.sharesOutstanding || '',
            marketPricePerShare: initialData?.marketPricePerShare || '',
            bookValuePerShare: initialData?.bookValuePerShare || '',
            earningsPerShare: initialData?.earningsPerShare || '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setSubmitting(true);
                setError(null);

                // Convert empty strings to null
                const formattedValues = Object.entries(values).reduce((acc, [key, value]) => {
                    acc[key] = value === '' ? null : value;
                    return acc;
                }, {});

                // Add statementId
                formattedValues.statementId = statementId;

                let response;
                if (isEditing) {
                    response = await updateFinancialData(initialData.id, formattedValues);
                } else {
                    response = await createFinancialData(formattedValues);
                }

                setSuccess(true);

                // Calculate derived values
                if (response?.data?.data?.id) {
                    await calculateDerivedValues(response.data.data.id);
                }

                // Call onSuccess callback
                if (onSuccess) {
                    onSuccess(response?.data?.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while saving financial data');
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Tab definitions
    const tabs = [
        { id: 'income', name: 'Income Statement' },
        { id: 'assets', name: 'Assets' },
        { id: 'liabilities', name: 'Liabilities & Equity' },
        { id: 'cashflow', name: 'Cash Flow' },
        { id: 'market', name: 'Market Data' },
    ];

    // Field group renderer
    const renderFieldGroup = (title, fields) => (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-secondary-900 mb-3">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                    <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-secondary-700">
                            {field.label}
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-secondary-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="text"
                                id={field.id}
                                name={field.id}
                                value={formik.values[field.id]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 sm:text-sm border-secondary-300 rounded-md ${
                                    formik.touched[field.id] && formik.errors[field.id]
                                        ? 'border-danger-300'
                                        : ''
                                }`}
                                placeholder={field.placeholder || '0.00'}
                            />
                        </div>
                        {formik.touched[field.id] && formik.errors[field.id] && (
                            <p className="mt-1 text-xs text-danger-600">{formik.errors[field.id]}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // Tab content definitions
    const tabContents = {
        income: (
            <>
                {renderFieldGroup('Revenue & Costs', [
                    { id: 'revenue', label: 'Revenue' },
                    { id: 'costOfSales', label: 'Cost of Sales' },
                    { id: 'grossProfit', label: 'Gross Profit' },
                ])}

                {renderFieldGroup('Operating Expenses', [
                    { id: 'operatingExpenses', label: 'Total Operating Expenses' },
                    { id: 'administrativeExpenses', label: 'Administrative Expenses' },
                    { id: 'sellingExpenses', label: 'Selling Expenses' },
                    { id: 'depreciation', label: 'Depreciation' },
                    { id: 'amortization', label: 'Amortization' },
                ])}

                {renderFieldGroup('Income', [
                    { id: 'operatingIncome', label: 'Operating Income' },
                    { id: 'interestExpense', label: 'Interest Expense' },
                    { id: 'otherIncome', label: 'Other Income' },
                    { id: 'earningsBeforeTax', label: 'Earnings Before Tax' },
                    { id: 'incomeTax', label: 'Income Tax' },
                    { id: 'netIncome', label: 'Net Income' },
                ])}
            </>
        ),

        assets: (
            <>
                {renderFieldGroup('Current Assets', [
                    { id: 'cash', label: 'Cash & Cash Equivalents' },
                    { id: 'shortTermInvestments', label: 'Short-term Investments' },
                    { id: 'accountsReceivable', label: 'Accounts Receivable' },
                    { id: 'inventory', label: 'Inventory' },
                    { id: 'otherCurrentAssets', label: 'Other Current Assets' },
                    { id: 'totalCurrentAssets', label: 'Total Current Assets' },
                ])}

                {renderFieldGroup('Non-Current Assets', [
                    { id: 'propertyPlantEquipment', label: 'Property, Plant & Equipment' },
                    { id: 'accumulatedDepreciation', label: 'Accumulated Depreciation' },
                    { id: 'intangibleAssets', label: 'Intangible Assets' },
                    { id: 'longTermInvestments', label: 'Long-term Investments' },
                    { id: 'otherNonCurrentAssets', label: 'Other Non-Current Assets' },
                    { id: 'totalNonCurrentAssets', label: 'Total Non-Current Assets' },
                ])}

                {renderFieldGroup('Total Assets', [
                    { id: 'totalAssets', label: 'Total Assets' },
                ])}
            </>
        ),

        liabilities: (
            <>
                {renderFieldGroup('Current Liabilities', [
                    { id: 'accountsPayable', label: 'Accounts Payable' },
                    { id: 'shortTermDebt', label: 'Short-term Debt' },
                    { id: 'accruedLiabilities', label: 'Accrued Liabilities' },
                    { id: 'otherCurrentLiabilities', label: 'Other Current Liabilities' },
                    { id: 'totalCurrentLiabilities', label: 'Total Current Liabilities' },
                ])}

                {renderFieldGroup('Non-Current Liabilities', [
                    { id: 'longTermDebt', label: 'Long-term Debt' },
                    { id: 'deferredTaxes', label: 'Deferred Taxes' },
                    { id: 'otherNonCurrentLiabilities', label: 'Other Non-Current Liabilities' },
                    { id: 'totalNonCurrentLiabilities', label: 'Total Non-Current Liabilities' },
                    { id: 'totalLiabilities', label: 'Total Liabilities' },
                ])}

                {renderFieldGroup('Equity', [
                    { id: 'commonStock', label: 'Common Stock' },
                    { id: 'additionalPaidInCapital', label: 'Additional Paid-in Capital' },
                    { id: 'retainedEarnings', label: 'Retained Earnings' },
                    { id: 'treasuryStock', label: 'Treasury Stock' },
                    { id: 'otherEquity', label: 'Other Equity' },
                    { id: 'totalEquity', label: 'Total Equity' },
                ])}
            </>
        ),

        cashflow: (
            <>
                {renderFieldGroup('Cash Flow Statement', [
                    { id: 'netCashFromOperating', label: 'Net Cash from Operating Activities' },
                    { id: 'netCashFromInvesting', label: 'Net Cash from Investing Activities' },
                    { id: 'netCashFromFinancing', label: 'Net Cash from Financing Activities' },
                    { id: 'netChangeInCash', label: 'Net Change in Cash' },
                ])}
            </>
        ),

        market: (
            <>
                {renderFieldGroup('Market Data', [
                    { id: 'marketCapitalization', label: 'Market Capitalization' },
                    { id: 'sharesOutstanding', label: 'Shares Outstanding' },
                    { id: 'marketPricePerShare', label: 'Market Price per Share' },
                    { id: 'bookValuePerShare', label: 'Book Value per Share' },
                    { id: 'earningsPerShare', label: 'Earnings per Share' },
                ])}
            </>
        ),
    };

    return (
        <Card
            title={isEditing ? 'Edit Financial Data' : 'Add Financial Data'}
            subtitle={`For statement ID: ${statementId}`}
        >
            <form onSubmit={formik.handleSubmit}>
                {error && (
                    <Alert
                        variant="danger"
                        title="Error"
                        dismissible
                        onDismiss={() => setError(null)}
                        className="mb-4"
                    >
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert
                        variant="success"
                        title="Success"
                        dismissible
                        onDismiss={() => setSuccess(false)}
                        className="mb-4"
                    >
                        {isEditing ? 'Financial data updated successfully.' : 'Financial data added successfully.'}
                    </Alert>
                )}

                {/* Tabs */}
                <div className="border-b border-secondary-200 mb-6">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab content */}
                <div>{tabContents[activeTab]}</div>

                {/* Help text */}
                <div className="text-xs text-secondary-500 mt-6 mb-4">
                    <p>
                        Note: You only need to enter values that you have available. Derived values (like totals) can be
                        calculated automatically if you enter the component values.
                    </p>
                </div>

                {/* Form actions */}
                <div className="flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onSuccess ? onSuccess() : null}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={submitting}
                        disabled={submitting || !formik.isValid}
                    >
                        {isEditing ? 'Update Financial Data' : 'Save Financial Data'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default FinancialDataForm;