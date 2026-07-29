import Resume from "../models/Resume.js";
import openai from "../configs/ai.js";

//controller for enhancing a resume's professional summary
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gemini-3.6-flash",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Rewrite the professional summary " +
            "provided by the user to make it more concise, impactful, and tailored " +
            "for a professional resume. Use strong action-oriented language, " +
            "avoid generic filler phrases, and keep it to 3-4 sentences. " +
            "Return only the rewritten summary text with no extra commentary, " +
            "labels, or quotation marks.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedSummary = response.choices[0].message.content;

    return res.status(200).json({
      message: "Summary enhanced successfully",
      enhancedSummary,
    });
  } catch (error) {
    const status = error?.status || error?.response?.status;

    if (status === 429) {
      return res.status(429).json({
        message:
          "AI service is busy right now. Please wait a moment and try again.",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

//controller for enhancing a resume's job description
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gemini-3.6-flash",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Rewrite the job description " +
            "provided by the user to make it more concise, impactful, and tailored " +
            "for a professional resume. Focus on achievements and measurable results " +
            "rather than routine duties, use strong action verbs, and avoid generic " +
            "filler phrases. Preserve the original bullet-point structure if the input " +
            "has one; otherwise return 3-5 bullet points. Return only the rewritten " +
            "content with no extra commentary, labels, or quotation marks.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedDescription = response.choices[0].message.content;

    if (!enhancedDescription) {
      return res.status(502).json({
        message: "Failed to generate enhanced description",
      });
    }

    return res.status(200).json({
      message: "Description enhanced successfully",
      enhancedDescription,
    });
  } catch (error) {
    const status = error?.status || error?.response?.status;

    if (status === 429) {
      return res.status(429).json({
        message:
          "AI service is busy right now. Please wait a moment and try again.",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

//controller for uploading a resume to the database
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const systemPrompt =
      "You are an expert AI agent to extract data from resume.";

    const userPrompt = `extract data from this resume : ${resumeText}
    Provide data in the following JSON format with no additional text before or after:
    
    {professional_summary: {type:String, default:''},
    skills: [{type:String}],
    personal_info : {
        image : {type:String, default:''},
        full_name : {type:String, default:''},
        profession : {type:String, default:''},
        email : {type:String, default:''},
        phone : {type:String, default:''},
        location : {type:String, default:''},
        linkedin : {type:String, default:''},
        website : {type:String, default:''},
    },
    experience : [
        {
            company : {type:String},
            position : {type:String},
            start_date : {type:String},
            end_date : {type:String},
            description : {type:String},
            is_current : {type:Boolean},
        }
    ],

    project : [
        {
            name : {type:String},
            type : {type:String},
            description : {type:String},
            
        }
    ],

    education : [
        {
            institution : {type:String},
            degree : {type:String},
            field : {type:String},
            graduation_date : {type:String},
            gpa : {type:String},
            
        }
    ],}
    `;

    const response = await openai.chat.completions.create({
      model: "gemini-3.6-flash",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    response_format: {
      type: "json_object";
    }

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return res.json({
      resumeId: newResume._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
