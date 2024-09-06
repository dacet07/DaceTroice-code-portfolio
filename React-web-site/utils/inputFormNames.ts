import { Language } from "../types/types";

interface InputFormNames {
  courseType: string;
  company: string;
  name: string;
  phone: string;
  email: string;
  comments: string;
  contactPerson: string;
  send: string;
  fieldRequired: string;
  emailNotValid: string;
  phoneNotValid: string;
  notChoosen: string;
}

const inputFormNames: Record<Language, InputFormNames> = {
  lv: {
    courseType: "Kursu veids:",
    company: "Uzņēmums:",
    name: "Vārds:",
    phone: "Tālrunis:",
    email: "E-pasts:",
    comments: "Komentāri:",
    contactPerson: "Kontaktpersona:",
    send: "Nosūtīt",
    fieldRequired: "Lūdzu, ievadiet šo lauku.",
    emailNotValid: "Lūdzu, ievadiet derīgu e-pasta adresi.",
    phoneNotValid: "Lūdzu, ievadiet derīgu tālruņa numuru.",
    notChoosen: "nav vēl izvēlēts",
    
  },
  en: {
    courseType: "Course Type:",
    company: "Company:",
    name: "Name:",
    phone: "Phone:",
    email: "Email:",
    comments: "Comments:",
    contactPerson: "Contact person:",
    send: "Send",
    fieldRequired: "Please enter this field.",
    emailNotValid: "Please enter a valid email address.",
    phoneNotValid: "Please enter a valid phone number.",
    notChoosen: "not yet chosen",
  },
  ru: {
    courseType: "Тип курса:",
    company: "Компания:",
    name: "Имя:",
    phone: "Телефон:",
    email: "Эл. почта:",
    comments: "Комментарии:",
    contactPerson: "Контактное лицо:",
    send: "Отправить",
    fieldRequired: "Пожалуйста, заполните это поле.",
    emailNotValid: "Пожалуйста, введите действительный адрес электронной почты.",
    phoneNotValid: "Пожалуйста, введите действительный номер телефона.",
    notChoosen: "еще не выбрано",
  },
};

export default inputFormNames;
