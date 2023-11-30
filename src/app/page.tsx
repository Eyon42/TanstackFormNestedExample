"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormApi, useField, useForm } from "@tanstack/react-form";
import Image from "next/image";
import { createContext, useContext, useState } from "react";

const defaultValues = {
  fullName: "",
  nestedA: "",
  nestedB: "",
};

const FormContext = createContext<{
  form: FormApi<typeof defaultValues, unknown>;
} | null>(null);

const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(`useFormContext must be used within a FormContextProvider`);
  }
  return context;
};

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm({
    defaultValues,
    onSubmit: async (values) => {
      setSubmitted(true);
    },
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono gap-4 text-sm flex flex-col">
            <h1>Nested Form Example</h1>
            <form.Field
              name="fullName"
              children={(field) => (
                <>
                  <label htmlFor={field.name}>Full Name</label>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            />
            <Tabs defaultValue="t1" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="t1">Tab 1</TabsTrigger>
                <TabsTrigger value="t2">Tab 2</TabsTrigger>
              </TabsList>
              <TabsContent value="t1">
                <FirstTab form={form} />
              </TabsContent>
              <TabsContent value="t2">
                <FormContext.Provider value={{ form }}>
                  <SecondTab />
                </FormContext.Provider>
              </TabsContent>
            </Tabs>
            <Button>Submit</Button>
            {submitted && <span>Submitted!</span>}
          </div>
        </form>
      </form.Provider>
    </main>
  );
}

type FirstTabProps = {
  form: FormApi<typeof defaultValues, unknown>;
};
function FirstTab({ form }: FirstTabProps) {
  return (
    <div className="bg-slate-100 flex flex-col gap-2 p-4">
      <h2>This tab takes a prop</h2>
      <form.Field
        name="nestedA"
        preserveValue
        children={(field) => (
          <>
            <label htmlFor={field.name}>Nested field A</label>
            <Input
              name={field.name}
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </>
        )}
      />
    </div>
  );
}

function SecondTab() {
  const { form } = useFormContext();
  return (
    <div className="bg-slate-100 p-4 flex flex-col gap-2">
      <span>This tab uses context</span>
      <form.Field
        name="nestedB"
        preserveValue
        children={(field) => (
          <>
            <label htmlFor={field.name}>Nested field B</label>
            <Input
              name={field.name}
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </>
        )}
      />
    </div>
  );
}
