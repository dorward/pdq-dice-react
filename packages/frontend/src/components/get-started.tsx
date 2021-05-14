import React, { useState, useEffect } from 'react';
import { Intent, Spinner, Callout, H1, Button, Menu, MenuItem } from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { Character } from '../types';
import EditCharacter from './edit-character';

// type Props = {
// 	characters: Character[];
// };

const GetStarted = () => {
	return <EditCharacter firstCharacter={true} />;
};

export default GetStarted;
