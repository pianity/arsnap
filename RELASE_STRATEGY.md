# Release Strategy

This document describe how every new releases should be made. Below is a list of tasks that will
have to be fulfilled for every release:

- Run `yarn lint-errors` and fix every errors.
- Run `yarn check-versions` to discover which packages needs to have their versions bumped. Pay
  attention to the new commits listed for every packages in order to know what each package bump
  should be (patch, minor or major).
- On Github Actions, run the `Create Release` workflow.
