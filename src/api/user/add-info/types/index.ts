interface InformationSubmissionParams {
  gender?: number
  phoneNumber?: string
  nation?: string
  position?: string | string[]
  birthday?: string
  politicalOutlook?: number
  partyJoiningTime?: string
  maritalStatus?: number
  englishProficiency?: string
  englishScore?: string
  homeLocation?: string
  currentLocation?: string
  civilServiceExam?: string
  educationBackground?: string
  undergraduateUniversity?: string
  undergraduateMajor?: string
  masterUniversity?: string
  masterMajor?: string
  phdUniversity?: string
  phdMajor?: string
  personalExperience?: string
  studentLeadershipExperience?: string
  academicHonors?: string
  disciplinaryRecord?: string
  otherSupportingDocuments?: string
}

export type GetInfoResponseData = ApiResponseData<InformationSubmissionParams>

export type AddInfoRequestData = InformationSubmissionParams
