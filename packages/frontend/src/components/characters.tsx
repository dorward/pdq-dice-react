import React, { useState, useEffect } from 'react';
import { Intent, Spinner, Callout, H1, Button, Menu, MenuItem } from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { Character } from '../types';

type Props = {
	characters: Character[];
};

const UserMenu = ({ characters }: Props) => {
	return <div>Characters Placeholder</div>;
};

export default UserMenu;
