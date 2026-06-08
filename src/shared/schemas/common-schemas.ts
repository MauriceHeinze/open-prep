import * as v from 'valibot';

import { aiProviderTypes } from '../domain/ai/provider-types';
import { examTypes } from '../domain/exams/exam-types';
import { sectionTypes } from '../domain/sections/section-types';
import { writingCriterionKeys } from '../domain/writing/writing-types';

export const examTypeSchema = v.picklist(examTypes);
export const sectionTypeSchema = v.picklist(sectionTypes);
export const aiProviderTypeSchema = v.picklist(aiProviderTypes);
export const writingCriterionKeySchema = v.picklist(writingCriterionKeys);
