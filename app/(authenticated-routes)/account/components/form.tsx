"use client"

import { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import { selectProfile } from "@/redux/slices/user-profile-slice"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn, supabase } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const formSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must not exceed 50 characters" })
    .regex(/[a-zA-Z][a-zA-Z ]+/, {
      message: "Name should not contain numbers or special characters",
    }),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must not exceed 50 characters" })
    .regex(/[a-zA-Z][a-zA-Z ]+/, {
      message: "Name should not contain numbers or special characters",
    }),
  username: z
    .string()
    .min(6, { message: "Username must be at least 6 characters" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^\w+$/),
  contact: z
    .string()
    .max(10, { message: "Contact number must not exceed 10 digits" }),
  date_of_birth: z.string(),
  address: z
    .string()
    .max(100, { message: "Address must not exceed 20 characters" }),
  bio: z.string().max(100),
})

type ProfilesSchema = {
  first_name: string
  last_name: string
  username: string
  contact: number
  date_of_birth: string
  bio: string
  address: string
  user_id: string
}

export default function AccountForm({
  allowedEdit,
  setAllowedEdit,
  isLoading,
  setIsLoading,
  user,
}: {
  allowedEdit: boolean
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setAllowedEdit: Dispatch<SetStateAction<boolean>>
  user: User
}) {
  const profile = useAppSelector(selectProfile)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: profile,
    values: profile,
  })

  const handleSave = async (values: ProfilesSchema) => {
    setIsLoading(true)
    const { error } = await supabase
      .from("profiles")
      .upsert(values)
      .eq("user_id", user.id)
      .single()

    if (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
    } else {
      toast({
        description: "Successfully updated your profile",
      })
      setAllowedEdit(false)
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit((values) => {
          const newProfile = {
            ...values,
            contact: parseInt(values.contact),
            user_id: profile?.user_id.length == 0 ? user.id : profile.user_id,
          }
          handleSave(newProfile)
        })}
      >
        <div className="md:flex-row flex flex-col md:gap-2 w-full">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{"First name"}</FormLabel>
                <FormControl>
                  <Input
                    required
                    autoCapitalize="words"
                    readOnly={!allowedEdit}
                    className={cn(
                      !allowedEdit && "focus-visible:ring-0",
                      "appearance-none w-full"
                    )}
                    type="text"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{"Last name"}</FormLabel>
                <FormControl>
                  <Input
                    autoCapitalize="words"
                    required
                    readOnly={!allowedEdit}
                    className={cn(
                      !allowedEdit && "focus-visible:ring-0",
                      "appearance-none w-full"
                    )}
                    type="text"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>{"Username"}</FormLabel>
              <FormControl>
                <Input
                  required
                  readOnly={!allowedEdit}
                  className={cn(
                    !allowedEdit && "focus-visible:ring-0",
                    "appearance-none"
                  )}
                  type="text"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Bio"}</FormLabel>
              <FormControl>
                <Textarea
                  required
                  className={cn(!allowedEdit && "focus-visible:ring-0")}
                  readOnly={!allowedEdit}
                  placeholder="Type your bio here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>{"Birth date"}</FormLabel>
              <FormControl>
                <Input
                  required
                  readOnly={!allowedEdit}
                  className={cn(
                    !allowedEdit && "focus-visible:ring-0",
                    "appearance-none"
                  )}
                  type="date"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>{"Contact Number"}</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex. 935XXXXXXX"
                  required
                  readOnly={!allowedEdit}
                  className={cn(
                    !allowedEdit && "focus-visible:ring-0",
                    "appearance-none"
                  )}
                  type="number"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>{"Address"}</FormLabel>
              <FormControl>
                <Input
                  required
                  readOnly={!allowedEdit}
                  className={cn(
                    !allowedEdit && "focus-visible:ring-0",
                    "appearance-none"
                  )}
                  type="text"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {allowedEdit && (
          <Button
            disabled={isLoading}
            type="submit"
            className={cn("mt-2 w-full")}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        )}
      </form>
    </Form>
  )
}
