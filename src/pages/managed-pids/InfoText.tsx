interface FieldInfo {
  label: string;
  info: string;
}

interface ProviderInfo {
  type: FieldInfo;
  name: FieldInfo;
  description: FieldInfo;
  regexes: FieldInfo;
  relies_on_dois: FieldInfo;
  modes: FieldInfo;
  examples: FieldInfo;
  resource_path_in_metadata: FieldInfo;
}

interface UserInfo {
  name: FieldInfo;
  surname: FieldInfo;
  email: FieldInfo;
  role: FieldInfo;
  description: FieldInfo;
}

const AddEditProviderInfo: ProviderInfo = {
  type: {
    label: "Label",
    info: "Please add the Name of the PID Type!",
  },
  name: {
    label: "Label",
    info: "Please add the Name of the Provider",
  },
  description: {
    label: "Label",
    info: "Please add a small description of the Provider",
  },
  regexes: {
    label: "Label",
    info: "Please define one or more regexes that represent your Persistent Identifier",
  },
  relies_on_dois: {
    label: "Label",
    info: "Please define is based on the DOI technology",
  },
  modes: {
    label: "Label",
    info: "Please select the mode that you support as provider.",
  },
  examples: {
    label: "Label",
    info: "Please add a PID that could be used as an example in the PID Meta Resolver",
  },
  resource_path_in_metadata: {
    label: "Label",
    info: "Define provider-specific path templates for metadata extraction",
  },
};

const PromotionRequestInfo: UserInfo = {
  name: {
    label: "Name",
    info: "Enter your first name.",
  },
  surname: {
    label: "Surname",
    info: "Enter your last name.",
  },
  email: {
    label: "Email",
    info: "Enter a valid email address.",
  },
  role: {
    label: "Role",
    info: "Specify the role you are requesting.",
  },
  description: {
    label: "Description",
    info: "Provide a brief description of why you are requesting this role.",
  },
};

export { AddEditProviderInfo, PromotionRequestInfo };
