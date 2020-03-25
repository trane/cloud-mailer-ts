import { SendRequest, SendResponse } from '../generated/cloud-mailer_pb';
import { MailerServiceClient } from '../generated/cloud-mailer_grpc_pb';
import { credentials, ServiceError } from 'grpc';

function main() {
	const client = new MailerServiceClient(
		'localhost:5000',
		credentials.createInsecure(),
	);
	const request = new SendRequest();

	client.send(request, (err: ServiceError | null, res?: SendResponse) => {
		if (err) {
			console.error('ERROR:', err);
		} else {
			console.info(`RESULT: ${res}`);
		}
	});
}

main();
