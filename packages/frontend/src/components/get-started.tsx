import React, { useState, useEffect } from 'react';
import { Intent, Spinner, Callout, H1, Button, Menu, MenuItem } from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { Character, UserData } from '../types';
import EditCharacter from './edit-character';

type Props = {
	userData: UserData;
};

const GetStarted = ({ userData }: Props) => {
	return <EditCharacter firstCharacter={true} userData={userData} />;
};

export default GetStarted;
