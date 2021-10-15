
let submissionCall = async () => {
    let call = await fetch('./submissions.json');
    let data = await call.json();
    return data;
}

export default submissionCall;