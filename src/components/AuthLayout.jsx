
import AuthLogo from './AuthLogo';
import AuthImage from './AuthImage';
import AuthFooter from './AuthFooter';
import { authImageFallbacks, authImages } from '../config/authImages';

const authImageFrameClass =
  'border-4 border-white rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]';

const signupPageBg =
  'bg-[linear-gradient(135deg,rgba(20,184,166,0.05)_0%,#F6F6F8_50%,rgba(20,184,166,0.05)_100%)]';

const AuthLeftBlurDecor = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
    <div
      className="absolute w-64 rounded-full bg-[#14B8A6] opacity-100 blur-[150px] backdrop-blur-[150px]"
      style={{ height: '409.59px', top: '-102.39px', left: '-64px' }}
    />
    <div
      className="absolute w-64 rounded-full bg-[#14B8A6] opacity-100 blur-[150px] backdrop-blur-[150px]"
      style={{ height: '409.59px', top: '716.8px', left: '512px' }}
    />
  </div>
);

const SplitAuthLayout = ({
  children,
  imageKey = 'login',
  title,
  subtitle,
  showFooter = false,
  formCard = true,
}) => {
  const src = authImages[imageKey];
  const fallback = authImageFallbacks[imageKey];

  return (
    <div className="min-h-screen flex w-full">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#193CE61A] flex-col p-10 xl:p-14">
        <AuthLeftBlurDecor />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center max-w-lg mx-auto w-full text-center px-4">
          <div className="mb-10">
            <AuthLogo />
          </div>
          <AuthImage
            src={src}
            fallback={fallback}
            alt=""
            className={`mb-10 ${authImageFrameClass}`}
          />
          <h2 className="text-2xl xl:text-[1.75rem] font-bold text-dark-blue mb-3 leading-snug">
            {title}
          </h2>
          <p className="text-gray-text text-sm leading-relaxed max-w-md">{subtitle}</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-14 bg-[#F6F6F8]">
        <div className="lg:hidden mb-6">
          <AuthLogo />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center w-full">
          {formCard ? (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_24px_rgba(15,23,42,0.06)] border border-[#E2E8F0]/60 p-8 sm:p-10">
              {children}
            </div>
          ) : (
            <div className="w-full max-w-md">{children}</div>
          )}
        </div>

        {showFooter && <AuthFooter />}
      </div>
    </div>
  );
};

const SignUpAuthLayout = ({ children, title, subtitle }) => {
  const src = authImages.signup;
  const fallback = authImageFallbacks.signup;

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-2 ${signupPageBg}`}>
      <div className="flex w-full max-w-[1060px] min-h-[min(640px,90vh)] flex-col overflow-hidden rounded-3xl bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.12)] lg:flex-row">
        <div className="flex min-h-[280px] flex-col bg-[#F6F6F8] px-8 py-8 sm:px-10 sm:py-10 lg:min-h-0 lg:w-[42%] lg:px-12 lg:py-8">

          <div className="flex flex-1 flex-col items-center justify-center">
          <AuthLogo className="self-start shrink-0" showIconShadow={false} />
              <AuthImage
                src={src}
                fallback={fallback}
                alt=""
                className="w-full"
              />
              <h2 className="mb-3 text-xl font-bold text-dark-blue sm:text-2xl">{title}</h2>
              <p className="max-w-[280px] text-sm leading-relaxed text-gray-text">{subtitle}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-white px-8 py-10 sm:px-10 sm:py-12 lg:w-[58%] lg:px-12 lg:py-8">
            {children}
        </div>
      </div>
    </div>
  );
};

const AuthLayout = ({ variant = 'split', ...props }) => {
  if (variant === 'signup') {
    return <SignUpAuthLayout {...props} />;
  }
  return <SplitAuthLayout {...props} />;
};

export default AuthLayout;
