const prompt = `
i need to get the audit report conclusion for an erc20 token under 100 words from the data i provide.
the  data that i am providing woulde be of the form 
{
    "token_name": "PEPE meme",  
    "token_symbol":"PEPE", 
    "is_honeypot": "0",
    "blacklisted": "1",
    "external_functions":"17",
    "internal_functions":"17",
    "private_functions":"17",
    "view_functions":"17",
    "pure_functions":"5"
    "number_of_medium_severity_issues":"4",
    "number_of_high_severity_issues":"9",
    "number_of_low_severity_issues":"0",
    "is_antiwhale":"1",
    "buy_tax":"5",
    "holder_count":"1000",
    "is_mintable":"1",
    "is_in_dex":"1",
    "is_open_source":"1",
    "lp_holder_count":"4",
    "is_in_dex":"1",
    "total_supply": "1000000000",
    "sell_tax": "0",
    "total_functions":"73"

}
There can be missing fioelds in the data that i provide. so the outsput should be changed as per that. ALso some parameters might be added along with it.
0 and 1 corresponds to false and true respectively,but for sell_tax and buy_tax they are numbers,and other numbers are just numbers. if numbers are high for holders it
means token has strong community and fundamentals, so it should be mentioned in the conclusion. and vice versa. similarly
if there are more high severity issues, it means token is risky and should be mentioned in the conclusion. and vice versa. Also
these kinds of checks needs to be done for tax,lp_holder_count and other parameters  with numbers.If some parameters are not given then omit it , and if some new parameters are given then 
understand what it represents from the variable name and populate it in the conclusion.

the conclusion should be of the form " This is the audit conclusion for the token PEPE meme (PEPE). The tokens has moderately strong 
holdings with 1000 holders and a a total supply of 1000000000. Upon analysis of the code we realized that the token doesnt have sell tax but has 5 % buy tax which is little high.
There are a total of 73 functions out of which 17 external are functions, 17 are internal functions, 17 are private functions and 17 are view functions.
There are no honeypots found during the analysis but there are 9 high severity issues and 4 medium severity issues found during the analysis. 
the token is antiwhale and  is listed on dexes also have 4 lp holders which is very less. The token is mintable and open source."

You can make it creative and more conveying, but should include all the data provided in the correct format.You should not sugarcoat 
or create a biased report. The report should be unbiased and should be based on the data provided. The report should be of 100 words.

Data is :
`;

module.exports={
    prompt
};