export const sectionTypes = ['reading', 'listening', 'writing', 'speaking'] as const;

export type SectionType = (typeof sectionTypes)[number];
