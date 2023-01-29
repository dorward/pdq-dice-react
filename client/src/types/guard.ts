import {
	AttributeUpdate,
	AttributeUpdateValue,
	AttributeUpdateNotes,
	ExtraUpdate,
	ExtraUpdateValue,
	ExtraUpdateLocation,
	ExtraUpdateCount,
} from './';

export const isAttributeUpdateValue = (data: AttributeUpdate): data is AttributeUpdateValue => 'value' in data;

export const isAttributeUpdateNotes = (data: AttributeUpdate): data is AttributeUpdateNotes => 'notes' in data;

export const isExtraUpdateValue = (data: ExtraUpdate): data is ExtraUpdateValue => 'value' in data;

export const isExtraUpdateCount = (data: ExtraUpdate): data is ExtraUpdateCount => 'count' in data;

export const isExtraUpdateLocation = (data: ExtraUpdate): data is ExtraUpdateLocation => 'location' in data;
