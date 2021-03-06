# static-content-network

static-content-network Amethyst Simple Content Distribution Server

## Installation

Using your preferred Node.js Package Manager. In the following commands, we will be using npm:

Configure your environment with both the `.env.template` and `ecosystem.config.json`, although we do not recommend changing the ecosystem at this time, if it can be helped.

```bash
git clone https://github.com/amethyst-studio/static-content-network

bash ./scripts/upgrade.sh # For initial install and future upgrades, run this script.
pm2 start ecosystem.config.js
```

## Examples

You can visit our [GitHub Wiki](https://github.com/amethyst-studio/static-content-network/wiki) for information in setting up and using this service.

If you are ever having any trouble, I would greatly recommend visiting the Wiki or opening a discussion to ask us questions directly. Issues will be converted to discussions if they do not follow the pre-determined issue templates.

## Contributing

Pull requests are always welcome for all of our projects.
If you intend to provide any underlying changes to the API, please open a discussion first so we can collaborate on the changes you intend to integrate to ensure data consistency. Pull Requests may be delayed or rejected if you do not reach out first and create significant changes.

## Code of Conduct

You can find more information on the Code of Conduct by visiting [Contributor Covenant's](https://www.contributor-covenant.org/) Official Website.

## License
[MIT](https://choosealicense.com/licenses/mit/)
