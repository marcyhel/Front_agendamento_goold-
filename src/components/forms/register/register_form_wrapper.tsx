"use client";

import { Suspense } from "react";
import SignUpForm from "./index";


const SignUpFormWrapper: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center py-4">Carregando formulário...</div>}>
      <SignUpForm />
    </Suspense>
  );
};

export default SignUpFormWrapper;
