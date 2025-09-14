import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Tailwind,
} from "@react-email/components";

interface VerifyOTPProps {
  otp: string;
  type: string;
}

const VerifyOTP = (props: VerifyOTPProps) => {
  const { otp } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white mx-auto px-[40px] py-[40px] rounded-[8px] max-w-[600px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[16px]">
                Verify Your Account
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Please use the verification code below to complete your sign-in
                process
              </Text>
            </Section>

            {/* OTP Code Section */}
            <Section className="text-center mb-[32px]">
              <div className="bg-gray-50 border-[2px] border-solid border-gray-200 rounded-[8px] py-[24px] px-[32px] inline-block">
                <Text className="text-[14px] text-gray-600 m-0 mb-[8px] uppercase tracking-wide">
                  Your Verification Code
                </Text>
                <Text className="text-[36px] font-bold text-gray-900 m-0 letter-spacing-[8px] font-mono">
                  {otp}
                </Text>
              </div>
            </Section>

            {/* Instructions */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 m-0 mb-[16px]">
                Enter this code in the verification field to complete your
                authentication. This code will expire in 5 minutes
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                If you didn&apos;t request this verification code, please ignore
                this email or contact our support team.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            {/* Security Notice */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 m-0 mb-[8px] font-semibold">
                Security Tips:
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                • Never share this code with anyone
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                • Our team will never ask for your verification code
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                • This code is only valid for one-time use
              </Text>
            </Section>

            {/* Footer */}
            <Hr className="border-gray-200 my-[32px]" />
            <Section className="text-center">
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                This email was sent to tranhailoc7@gmail.com
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                © 2024 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                123 Business Street, Ho Chi Minh City, Vietnam
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyOTP;
