export interface IUseCase<Input, Output> {
	exec(input: Input): Promise<Output>;
}
