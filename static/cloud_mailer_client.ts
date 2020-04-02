import {
	SendRequest,
	SendResponse,
	Recipient,
} from '../generated/cloud-mailer_pb';
import { MailerServiceClient } from '../generated/cloud-mailer_grpc_pb';
import { credentials, ServiceError, Metadata } from 'grpc';
import { NewInMemorySLLS } from '@sisense/local-licensing-service';
const stagingSelsUrl = 'https://sels.dec-staging.periscopedata.com';

// Any random string ID to identify a Sisense deployment
const deploymentId = 'andrew-testing-cloud-mailer';
const maxWaitOnRetryInMS = 60 * 1000;
const socketTimeoutInMS = 5 * 1000;

const cloudServiceId = 'dec-development';
const oauthScopes = ['read:anotherservice'];

const serviceUrl = 'localhost:5551';

async function main() {
	const sllsInstance = NewInMemorySLLS(
		stagingSelsUrl, // or productionSelsUrl
		deploymentId,
		maxWaitOnRetryInMS,
		socketTimeoutInMS,
	);
	const client = new MailerServiceClient(
		serviceUrl,
		credentials.createInsecure(),
	);
	const request = new SendRequest();
	const recipient = new Recipient();
	request.addRecipients(recipient);
	try {
		await sllsInstance.createOauthClientCredentials(
			'email@example.com',
			'secrets',
			'machineId',
		);
		const meta = new Metadata();
		const token = await sllsInstance.getOauthAccessToken(
			cloudServiceId,
			oauthScopes,
		);
		meta.add('authentication', `Bearer: ${token}`);
		client.send(
			request,
			meta,
			(err: ServiceError | null, res?: SendResponse) => {
				if (err) {
					console.error('ERROR:', err);
				} else {
					console.info(`RESULT: ${res}`);
				}
			},
		);
	} catch (e) {
		console.error('ERROR SENDING:', e);
	}
}

main();
