declare module '@sisense/sisense-configuration' {
	export type Tracing = {
		enabled: boolean;
		debug?: boolean;
		sampleState: 0 | 1 | null; // if null, let another entity in tracing decide if it is sampled
	};
}
