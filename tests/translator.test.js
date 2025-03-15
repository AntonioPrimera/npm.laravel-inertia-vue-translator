import { expect, test } from 'vitest'
import Translator from '../src/Translator';

const dictionary = {
	yes: 'Yes',
	
	greetings: {
		hi: 'Hi',
		hello: 'Hello :name',
	},
	companies: {
		label: 'Company|Companies',
		title: '{0}No company available|{1} One company available|[2-10] :count companies available|[11-*] A lot of companies available',
		name: '{0}No company|{1}Company :name|{2}Company :name and :other|[3-*]More than 2 companies',
	},
	
	labels: {
		person: '{0}Nobody|[5-*]A lot of people',
		dogs: '',
	},
	
	defaults: {
		count: 'There are :count items',
		name: 'My name is :name',
		numericValue: 'The numeric value is :value',
		stringValue: 'The string value is :value',
	},
};

const translator = new Translator(dictionary);
const __ = (key, replace) => translator.translate(key, replace);
const ___ = (key, count, replace) => translator.translatePlural(key, count, replace);

test('it can use a function as the dictionary', () => {
	const fTranslator = new Translator(() => dictionary);
	expect(fTranslator.getDictionary()).toEqual(dictionary);
	expect(fTranslator.translate('yes')).toBe('Yes');
});

test('it can translate a simple string', () => {
	expect(translator).toBeInstanceOf(Translator);
	expect(__('yes')).toBe('Yes');
	expect(__('not-found')).toBe('not-found');
});

test('it can translate a string with placeholders', () => {
	expect(__('greetings.hi')).toBe('Hi');
	expect(__('greetings.hello', { name: 'John' })).toBe('Hello John');
	expect(__('greetings.hello', { name: 'Jane', other: 'Sam' })).toBe('Hello Jane');
	expect(__('greetings.hello', { other: 'Sam' })).toBe('Hello :name');
});

test('it allows usage of a string or number as a replace value', () => {
	expect(__('defaults.count', 5)).toBe('There are 5 items');
	expect(__('defaults.name', 'John')).toBe('My name is John');
	expect(__('defaults.numericValue', 5)).toBe('The numeric value is 5');
	expect(__('defaults.stringValue', 'five')).toBe('The string value is five');
});

test('it does not accept a function as a replace value', () => {
	expect(__('defaults.name', () => 'John')).toBe('My name is :name');
});

test('it can translate a plural string', () => {
	expect(___('companies.title', 0)).toBe('No company available');
	expect(___('companies.title', 1)).toBe('One company available');
	expect(___('companies.title', 2)).toBe('2 companies available');
	expect(___('companies.title', 10)).toBe('10 companies available');
	expect(___('companies.title', 11)).toBe('A lot of companies available');
	expect(___('companies.title', 100)).toBe('A lot of companies available');
	
	expect(___('companies.label', 0)).toBe('Companies');
	expect(___('companies.label', 1)).toBe('Company');
	expect(___('companies.label', 2)).toBe('Companies');
	
	expect(___('hi', 1)).toBe('hi');
	expect(___('hi', 2)).toBe('hi');
	
	expect(___('companies.name', 0)).toBe('No company');
	expect(___('companies.name', 1, { name: 'Apple' })).toBe('Company Apple');
	expect(___('companies.name', 2, { name: 'Apple' })).toBe('Company Apple and :other');
	expect(___('companies.name', 2, { name: 'Apple', other: 'Microsoft' })).toBe('Company Apple and Microsoft');
	expect(___('companies.name', 3)).toBe('More than 2 companies');
	
	//weird cases
	expect(___(null)).toBe(null);
	expect(___(undefined)).toBe(undefined);
	expect(___('')).toBe('');
	expect(___('labels.person', 1)).toBe('{0}Nobody');
	expect(___('labels.non-existing', 5)).toBe('labels.non-existing');
});

test('it can translate and replace a key with a missing translation', () => {
	expect(__('Hi, my name is :name', { name: 'John' })).toBe('Hi, my name is John');
});

test('it can translate a composite key', () => {
	//key and count
	expect(__('companies.label[1]')).toBe('Company');
	expect(__('companies.label[2]')).toBe('Companies');
	expect(__('companies.title[3]')).toBe('3 companies available');
	
	//key and replace
	expect(__('greetings.hello{name:John}')).toBe('Hello John');
	
	//key, count and replace
	expect(__('greetings.hello{name:Jane,other:Sam}')).toBe('Hello Jane');
	expect(__('companies.name[2]{name:Apple,other:Microsoft}')).toBe('Company Apple and Microsoft');
	
	//non-existing key and replace
	expect(__('Hi, my name is :name!{name:John}')).toBe('Hi, my name is John!');
	
	//key and count for translation without plural forms
	expect(__('hi[1]')).toBe('hi');
	expect(__('hi[2]{name: John}')).toBe('hi');
	
	//bad count
	expect(___('companies.title[0')).toBe('companies.title[0');
	expect(___('companies.title[abc]')).toBe('companies.title[abc]');
	
	//bad replace
	expect(__('greetings.hello{name:John')).toBe('greetings.hello{name:John');
	
	//bad count and replace
	expect(__('companies.name[2]{name:Apple')).toBe('companies.name[2]{name:Apple');
	
	//bad key
	expect(__('[{')).toBe('[{');
	
	//empty key
	expect(__('')).toBe('');
	expect(__(null)).toBe(null);
	expect(__(undefined)).toBe(undefined);
});