# Changes

## v2.4.1

### Bugfixes

- Fix package.json after a release script saved the wrong data over it

## v2.4.0

### Features

- Added a Skill Check section on the plain dice roll tab. This allows GMs to make Skill Checks for ad-hoc characters without having to create a character sheet for them.

### Bugfixes

- Full details of the previous dice roll are now stored and used for Benny re-rolls. This fixes a bug where a limited use item, that had its last charge expended on the original roll, would not be included in the re-roll.
- State is now saved when character visibility is toggled. This fixes a bug where if you changed the visibility and then did no other edit that would trigger a save, the next visit would restore visibility to the previous state.
- The character selection algorithm now selects the clicked tab or, if the default tab is viewed, the first visible character. Previously it would select the first character meaning that skills would be searched for on the wrong character sheet if the first character was hidden.
- Code names are now shown in dice rolls on Discord. Previously if a character didn't have a regular name it would default to the player name.

### Housekeeping

- Dependency updates.
- Refactor ESLint config.
