import {
	SendRequest,
	SendResponse,
	Recipient,
	Attachment,
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

type recipient = {
	name?: string;
	address: string;
};

type recepients = {
	to?: recipient[];
	cc?: recipient[];
	bcc?: recipient[];
};

type message = {
	senderEmail: string;
	senderName: string;
	fromEmail: string;
	recipients: recepients;
	subject: string;
	body: string;
	images: Attachment.AsObject[];
	attachments: Attachment.AsObject[];
};

const getRecipient = (type: Recipient.AsObject['type']) => (
	r: recipient,
): Recipient => {
	const recipient = new Recipient();
	recipient.setEmail(r.address);
	if (r.name) {
		recipient.setName(r.name);
	}
	recipient.setType(type);
	return recipient;
};

const getRecipients = (recipients: recepients): Recipient[] => {
	const to = recipients.to?.map(getRecipient(Recipient.RecipientType.TO)) ?? [];
	const cc = recipients.cc?.map(getRecipient(Recipient.RecipientType.CC)) ?? [];
	const bcc =
		recipients.bcc?.map(getRecipient(Recipient.RecipientType.BCC)) ?? [];

	return to.concat(cc).concat(bcc);
};

const getAttachments = (attachments: Attachment.AsObject[]): Attachment[] => {
	return attachments.map((i) => {
		const a = new Attachment();
		a.setName(i.name);
		a.setType(i.type);
		a.setName(i.name);
		return a;
	});
};

const getCloudMailerMessage = ({
	senderEmail,
	senderName,
	fromEmail,
	recipients,
	subject,
	body,
	images,
	attachments,
}: message) => {
	const message = new SendRequest();
	message.setFromemail(senderEmail);
	message.setFromname(senderName);
	message.setReplytoemail(fromEmail);
	message.setRecipientsList(getRecipients(recipients));
	message.setHtmlbody(body);
	message.setImagesList(getAttachments(images));
	message.setAttachmentsList(getAttachments(attachments));
	message.setSubject(subject);
	return message;
};

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
	const req: message = {
		senderEmail: '',
		attachments: [],
		body: '',
		fromEmail: '',
		images: [],
		recipients: { to: [], cc: [], bcc: [] },
		senderName: '',
		subject: '',
	};
	const request = getCloudMailerMessage(req);
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
