export interface UseCase<Input, Output> {
	exec(input: Input): Promise<Output>;
}
