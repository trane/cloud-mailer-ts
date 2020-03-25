import { credentials, ServiceError, loadPackageDefinition } from 'grpc';
import { loadSync } from '@grpc/proto-loader';

const protoRootDir = `${process.env['CLOCKTOWER_ROOT']}/periscope/cloud-mailer`;
const protoPath = `${protoRootDir}/cloud-mailer.proto`;
const packageDefinition = loadSync(protoPath, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const { MailerService, SendRequest, SendResponse } = loadPackageDefinition(
	packageDefinition,
) as any;

function main() {
	const client = new MailerService(
		'localhost:5000',
		credentials.createInsecure(),
	);

	client.send(
		{} as typeof SendRequest,
		(err: ServiceError | null, res?: typeof SendResponse) => {
			if (err) {
				console.error('ERROR:', err);
			} else {
				console.info(`RESULT: ${res}`);
			}
		},
	);
}

main();
