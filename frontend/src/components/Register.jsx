import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Select,
  Link,
  Flex,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  id: Yup.string()
    .matches(/^[1-9]{1}[0-9]{9}[02468]{1}$/, "Geçersiz T.C. Kimlik Numarası")
    .required("T.C. Kimlik Numarası gerekli"),
  firstName: Yup.string()
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "İsim özel karakter içeremez")
    .required("İsim gerekli"),
  password: Yup.string()
    .required("Şifre gerekli")
    .min(6, "Şifre en az 6 karakterden oluşmalı"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmeli")
    .required("Şifre kontrol gerekli"),
  lastName: Yup.string()
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Soyisim özel karakter içeremez")
    .required("Soyisim gerekli"),
  dateOfBirth: Yup.date()
    .max(new Date(), "Doğum tarihi gelecek bir tarih olamaz")
    .required("Doğum tarihi gerekli"),
  gender: Yup.string().required("Cinsiyet gerekli"),
  phoneNumber: Yup.string()
    .matches(
      /^[0-9]{3}[0-9]{3}[0-9]{4}$/,
      "Telefon numarası XXX XXX XX XX formatında olmalı"
    )
    .transform((value, originalValue) => {
      // Remove all spaces from the phone number
      return originalValue.replace(/\s/g, "");
    }),
  email: Yup.string().email("Geçerli bir e-posta adresi girin"),
});
const RegisterPage = ({ authToken, setAuthToken }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    try {
      const requestBody = {
        patientID: values.id,
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        password: values.password,
      };
      if (values.email) {
        requestBody.email = values.email;
      }

      if (values.phoneNumber) {
        requestBody.phoneNumber = values.phoneNumber;
      }
      console.log(requestBody);
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json(); // Read the response body as JSON
      console.log("RESPONSE", data.token);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem(
          "fullName",
          `${values.firstName} ${values.lastName}`
        );
        localStorage.setItem("patientID", data.patientID);
        localStorage.setItem("userType", data.userType);
        // Registration successful, set isRegistered to true
        await setAuthToken(data.token);
        navigate("/patient-main");
        setIsRegistered(true);
      } else {
        // Registration failed, handle error
        console.error("Registration failed");
        // You can display an error message to the user if needed
      }

      console.log(`submitted`);
      actions.resetForm();
    } catch (error) {
      console.error("Error registering user:", error);
      // You can display an error message to the user if needed
    } finally {
      actions.setSubmitting(false);
    }
  };

  if (isRegistered) {
    return navigate("/patient-main");
  }
  return (
    <ChakraProvider>
      <Box
        p={8}
        maxW="md"
        mx="auto"
        mt="7vh"
        boxShadow="md"
        borderWidth="1px"
        borderRadius="md"
        display="flex"
        flexDirection="column"
      >
        <Formik
          initialValues={{
            id: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form>
              <Field name="id">
                {({ field, form }) => (
                  <FormControl
                    mt={4}
                    isInvalid={form.errors.id && form.touched.id}
                  >
                    <FormLabel htmlFor="id">T.C.</FormLabel>
                    <Input
                      {...field}
                      id="id"
                      placeholder="T.C. Kimlik Numarası"
                    />
                    <FormErrorMessage>{form.errors.id}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Flex direction="row">
                <Field name="firstName">
                  {({ field, form }) => (
                    <FormControl
                      mt={4}
                      mr={2}
                      flex={2}
                      isInvalid={
                        form.errors.firstName && form.touched.firstName
                      }
                    >
                      <FormLabel htmlFor="firstName">İsim</FormLabel>
                      <Input {...field} id="firstName" placeholder="İsim" />
                      <FormErrorMessage>
                        {form.errors.firstName}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="lastName">
                  {({ field, form }) => (
                    <FormControl
                      mt={4}
                      flex={3}
                      isInvalid={form.errors.lastName && form.touched.lastName}
                    >
                      <FormLabel htmlFor="lastName">Soyisim</FormLabel>
                      <Input {...field} id="lastName" placeholder="Soyisim" />
                      <FormErrorMessage>
                        {form.errors.lastName}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex>
              <Field name="dateOfBirth">
                {({ field, form }) => (
                  <FormControl
                    mt={4}
                    isInvalid={
                      form.errors.dateOfBirth && form.touched.dateOfBirth
                    }
                  >
                    <FormLabel htmlFor="dateOfBirth">Doğum Tarihi</FormLabel>
                    <Input
                      {...field}
                      type="date"
                      id="dateOfBirth"
                      placeholder="Doğum Tarihi"
                    />
                    <FormErrorMessage>
                      {form.errors.dateOfBirth}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="gender">
                {({ field, form }) => (
                  <FormControl
                    mt={4}
                    isInvalid={form.errors.gender && form.touched.gender}
                  >
                    <FormLabel htmlFor="gender">Cinsiyet</FormLabel>
                    <Select
                      {...field}
                      id="gender"
                      placeholder="Cinsiyetinizi Seçin"
                    >
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                      <option value="Diğer">Diğer</option>
                    </Select>
                    <FormErrorMessage>{form.errors.gender}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl
                    mt={4}
                    isInvalid={form.errors.email && form.touched.email}
                  >
                    <FormLabel htmlFor="email">E-posta</FormLabel>
                    <Input {...field} id="email" placeholder="E-posta" />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="phoneNumber">
                {({ field, form }) => (
                  <FormControl
                    mt={4}
                    isInvalid={
                      form.errors.phoneNumber && form.touched.phoneNumber
                    }
                  >
                    <FormLabel htmlFor="phoneNumber">
                      Telefon Numarası
                    </FormLabel>
                    <Input
                      {...field}
                      id="phoneNumber"
                      placeholder="Telefon Numarası"
                    />
                    <FormErrorMessage>
                      {form.errors.phoneNumber}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, form }) => (
                  <FormControl
                    mt={4}
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel htmlFor="password">Şifre</FormLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Şifre"
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="confirmPassword">
                {({ field, form }) => (
                  <FormControl
                    mt={4}
                    isInvalid={
                      form.errors.confirmPassword &&
                      form.touched.confirmPassword
                    }
                  >
                    <FormLabel htmlFor="confirmPassword">
                      Şifreyi Onayla
                    </FormLabel>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      placeholder="Şifreyi Onayla"
                    />
                    <FormErrorMessage>
                      {form.errors.confirmPassword}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              {/* Add other fields as needed */}
              <Button
                type="submit"
                mt={6}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                width="100%"
              >
                Kayıt Ol
              </Button>
              <Box mt={4}>
                <Link href="/login">
                  Zaten bir hesabın var mı? Hemen Giriş yap!
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </ChakraProvider>
  );
};

export default RegisterPage;
