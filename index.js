'use strict';
const alfy = require('alfy');
const { URL } = require('url');
const host = process.env['GITLAB_HOST'];
const token = process.env['GITLAB_TOKEN'];

if (!host || !token) {
	alfy.error('Please set "GITLAB_HOST" and "GITLAB_TOKEN" workflow variables.');
	return;
}

const api = new URL('api/v4/search', host)
alfy.fetch(api.href, {
	headers: {
		'PRIVATE-TOKEN': token
	},
	query: {
		scope: 'projects',
		search: alfy.input
	}
}).then(data => {
	const items = data
		.map(pkg => {
			return {
				uid: pkg.id,
				title: pkg.name_with_namespace,
				subtitle: pkg.path_with_namespace,
				arg: pkg.web_url,
				mods: {
					cmd: {
						arg: pkg.ssh_url_to_repo,
						subtitle: pkg.ssh_url_to_repo
					}
				}
			};
		});
	alfy.output(items);
});
