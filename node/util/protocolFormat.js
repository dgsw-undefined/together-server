
//Protocol Format을 정의해놓은 파일

var team = {}
var trust = {}

//Team Protocol

//team Error

team.error = (res,err) => {
  return res.send({
   "Code" : 200,
   "Desc" : err.message
 });
}

//Team Success

team.success = (res,rows) => {
  return res.send({
   "Code" : 201,
   "Desc" : "success",
   "Data" : rows
 });
}

//Team Not Found

team.notFound = (res) => {
  return res.send({
    "Code" : 202,
    "Desc" : "Data not Found"
  })
}

//Trust Protocol

//trust error

trust.error = (res,err) => {
  return res.send({
   "Code" : 112,
   "Desc" : err.message
 });
}

//trust Success

trust.success = (res,rows) => {
  return res.send({
   "Code" : 111,
   "Desc" : "success",
   "Data" : rows
 });
}

//trsuter Not Found

trust.notFound = (res) => {
  return res.send({
    "Code" : 113,
    "Desc" : "Data not Found"
  })
}

module.exports={
  team:team,
  trust:trust
}
