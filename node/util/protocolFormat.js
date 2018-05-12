
//Protocol Format을 정의해놓은 파일


//Team Error

exports.error = (res,err) => {
  return res.send({
   "Code" : 200,
   "Desc" : err.message
 });
}

//Team Success

exports.success = (res,rows) => {
  return res.send({
   "Code" : 201,
   "Desc" : "success",
   "Data" : rows
 });
}

//Team Not Found

exports.notFound = (res) => {
  return res.send({
    "Code" : 202,
    "Desc" : "Data not Found"
  })
}
