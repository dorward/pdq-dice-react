import { Extra } from '../../types';

const sortExtras = (extras: Extra[]) => [...extras].sort((a, b) => a.name.localeCompare(b.name));

export default sortExtras;
