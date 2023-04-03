![TyTra](./tytra.png)

# Typed Translations - TyTra-Core

Set of functions inspred by prisma, to create and mantain statically typed translations on any typescript project.

# How to use

You can use it with a UI:
- https://github.com/z3phyro/tytra-ui

Or with a CLI: 
- https://github.com/z3phyro/tytra-cli

# Why use TyTra

Not all javascript/typescript projects use some sort of CMS. I've worked before for companies that literally use a spreadsheet for making their translations in some projects.

In general the process of preparing translations is not so difficult if you have a small project but as the project grows it can get kind of tedious.

Having mutiple languages to translate to makes the process a bit more difficult.

Both the CLI and the UI provide some useful features for both the developer and the translator.

# TyTra Features

- Zero dependencies
- Translation Coverage
- Multi dictionary management
- Import preivous translation files
- Add remove and edit translations on one or multiple languages using a [CLI](https://github.com/z3phyro/tytra-cli) or a [UI](https://github.com/z3phyro/tytra-ui)
- Typescript interfaces for translations

# Next steps to work on:

- [ ] Add configuration file
- [ ] Add validations
- [ ] Add sanitation to the user inputs
- [ ] Improve the UI Experience
- [ ] Create a website for documentation
- [ ] Add some sort of plain security to use when hosting
- [ ] Improve the cli dependencies. (Right now it has 3 but it could be only 1)
- [ ] Integrate with Github and/or Gitlab. The idea would be to create PRs for the changes of a particular translator (person).
