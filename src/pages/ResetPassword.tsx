import { type Component, Suspense } from "solid-js";

const ResetPassword: Component = () => {
    return (
        <div class="h-full grid grid-rows-[64px_1fr]">
            <Suspense fallback={<hr />}>
            </Suspense>
        </div>
    );
};
export default ResetPassword;
